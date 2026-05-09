import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { initCloudinary } from "./cloudinary/cloudinary.client";
import { InjectRepository } from "@nestjs/typeorm";
import { Media } from "./media.entities";
import { Repository } from "typeorm";
import { KAFKA_SERVICE } from "@app/kafka";
import { ClientKafka } from "@nestjs/microservices";
import { UploadProductImageDto } from "./dto/uploadProductImage.dto";
import { User } from "apps/auth/src/entities/users.entity";

@Injectable()
export class MediaService {
  private readonly cloudinary = initCloudinary();

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @Inject(KAFKA_SERVICE)
    private readonly kafkaClient: ClientKafka,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async uploadProductImage(uploadProductImage: UploadProductImageDto) {
    // 1. Validation
    if (!uploadProductImage.base64 || !uploadProductImage.mimetype.startsWith("image/")) {
      throw new BadRequestException("Invalid image input. Check mimetype and base64.");
    }

    const buffer = Buffer.from(uploadProductImage.base64, "base64");
    if (buffer.length === 0) {
      throw new BadRequestException("Invalid image data: Buffer is empty");
    }

    // 2. Cloudinary Upload via Stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER,
          resource_type: "image"
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // 3. Extract and Validate Cloudinary Response
    const url = uploadResult?.secure_url || uploadResult?.url;
    const publicId = uploadResult?.public_id; // Fixed syntax: added dot and underscore

    if (!url || !publicId) {
      throw new NotFoundException("Cloudinary did not return a proper response");
    }

    // 4. Persistence (Optional but recommended)
    // You likely want to save this to your Media table
    const media = this.mediaRepository.create({
      url,
      publicId,
      mimetype: uploadProductImage.mimetype,
      userId: uploadProductImage.uploadByUserId,

      productId: undefined
    });
    const savedMedia = await this.mediaRepository.save(media);

    return {
      success: true,
      data: savedMedia
    };
  }

  async attachToProduct(payload: { productId: string; mediaId: string }) {
    const updatedMedia = await this.mediaRepository.update(payload.mediaId, {
      productId: payload.productId
    });
    if (!updatedMedia) {
      throw new NotFoundException("no media found");
    }

    return {
      success: true,
      data: updatedMedia
    };
  }
}
