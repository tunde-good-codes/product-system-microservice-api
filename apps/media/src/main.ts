import { KAFKA_BROKER } from "./../../../libs/kafka/src/constants/kafka.topics";
import { NestFactory } from "@nestjs/core";
import { MediaModule } from "./media.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SERVICES_PORTS } from "@app/common/constants/services.contants";
import { Transport } from "@nestjs/microservices";
import { options } from "axios";

async function bootstrap() {
  process.title = "media service";

  const logger = new Logger("media service is running");

  const app = await NestFactory.create(MediaModule);
  app.enableShutdownHooks();

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER]
      },
      consumer: {
        groupId: "media-service-group"
      }
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  await app.startAllMicroservices();

  await app.listen(SERVICES_PORTS.MEDIA_SERVICE ?? 3006);

  logger.log("media service is running on port: " + SERVICES_PORTS.MEDIA_SERVICE);
}
bootstrap();
