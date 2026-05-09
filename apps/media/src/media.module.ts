import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Media } from "./media.entities";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    TypeOrmModule.forFeature([Media])
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
