import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { initCloudinary } from "./cloudinary/cloudinary.client";
import { InjectRepository } from "@nestjs/typeorm";
import { Media } from "./media.entities";
import { Repository } from "typeorm";
import { KAFKA_SERVICE } from "@app/kafka";
import { ClientKafka } from "@nestjs/microservices";
import { UploadProductImageDto } from "./dto/uploadProductImage.dto";
import { KAFKA_TOPICS } from "@app/kafka/constants/kafka.topics";

@Injectable()
export class MediaService {
  private readonly cloudinary = initCloudinary();

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @Inject(KAFKA_SERVICE)
    private readonly kafkaClient: ClientKafka,

  ) {}
// media.service.ts
async uploadProductImage(uploadProductImage: UploadProductImageDto & { productId?: string }) {
  if (!uploadProductImage.base64 || !uploadProductImage.mimetype.startsWith("image/")) {
    throw new BadRequestException("Invalid image input.");
  }

  const buffer = Buffer.from(uploadProductImage.base64, "base64");

  const uploadResult: any = await new Promise((resolve, reject) => {
    const uploadStream = this.cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    uploadStream.end(buffer);
  });

  const url = uploadResult?.secure_url || uploadResult?.url;
  const publicId = uploadResult?.public_id;
  if (!url || !publicId) throw new NotFoundException("Cloudinary upload failed");

  const media = this.mediaRepository.create({
    url,
    publicId,
    mimetype: uploadProductImage.mimetype,
    userId: uploadProductImage.uploadByUserId,
    productId: uploadProductImage.productId,  // ← attach immediately
  });
  const savedMedia = await this.mediaRepository.save(media);

  // Tell product service the URL is ready
  if (uploadProductImage.productId) {
    this.kafkaClient.emit(KAFKA_TOPICS.MEDIA_ATTACHED, {
      productId: uploadProductImage.productId,
      imageUrl: url,
      mediaId: savedMedia.id,
    });
  }

  return { success: true, data: savedMedia };
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
