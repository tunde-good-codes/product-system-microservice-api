import { NestFactory } from "@nestjs/core";
import { MediaModule } from "./media.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SERVICES_PORTS } from "@app/common/constants/services.contants";

async function bootstrap() {
  process.title = "media service";

  const logger = new Logger("media service is running");

  const app = await NestFactory.create(MediaModule);
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  await app.listen(SERVICES_PORTS.MEDIA_SERVICE ?? 3005);

  logger.log("media service is running")
}
bootstrap();
