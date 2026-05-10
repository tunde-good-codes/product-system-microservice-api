import { IsOptional, IsString } from "class-validator";


export class UploadProductImageDto {
  @IsString()
  filename: string;
  @IsString()
  mimetype: string;
  @IsString()
  base64: string;
  @IsString()
  uploadByUserId: string;
  @IsOptional()
  @IsString()
  productId?: string;   // ← add this
}


export class AttachToProductDto {
  @IsString()
  mediaId: string;
  @IsString()
  productId: string;
  @IsString()
  @IsOptional()
  attachedByUserId: string;
}
