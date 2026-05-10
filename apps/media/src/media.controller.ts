import { Body, Controller, Get } from "@nestjs/common";
import { MediaService } from "./media.service";
import { UploadProductImageDto } from "./dto/uploadProductImage.dto";
import { KAFKA_TOPICS } from "@app/kafka/constants/kafka.topics";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get("upload-image")
  async uploadProductImage(@Body() uploadProductImageDto: UploadProductImageDto) {
    return await this.mediaService.uploadProductImage(uploadProductImageDto);
  }
@MessagePattern(KAFKA_TOPICS.PRODUCT_CREATED)
async handleProductCreated(
  @Payload()
  payload: {
    id: string;
    imageBase64?: string;
    imageMimetype?: string;
    imageFilename?: string;
    uploadedByUserId?: string;
  }
) {
  

  if (!payload.imageBase64 || !payload.imageMimetype) {
    console.log("No image provided");
    return;
  }

  await this.mediaService.uploadProductImage({
    base64: payload.imageBase64,
    mimetype: payload.imageMimetype,
    filename: payload.imageFilename ?? "upload",
    uploadByUserId: payload.uploadedByUserId ?? "",
    productId: payload.id,
  });

  console.log("Image uploaded successfully");
}
}
