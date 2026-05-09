import { Body, Controller, Get } from "@nestjs/common";
import { MediaService } from "./media.service";
import { UploadProductImageDto } from "./dto/uploadProductImage.dto";

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}


  @Get("upload-image")
  async uploadProductImage(@Body() uploadProductImageDto: UploadProductImageDto) {
    return await this.mediaService.uploadProductImage(uploadProductImageDto);
  }
}
