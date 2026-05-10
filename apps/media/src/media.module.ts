import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Media } from "./media.entities";
import { KafkaModule } from "@app/kafka";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    TypeOrmModule.forFeature([Media]),
    KafkaModule.register("media-service-group")
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
