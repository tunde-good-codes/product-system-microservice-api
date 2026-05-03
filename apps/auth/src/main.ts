/* eslint-disable prettier/prettier */
import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SERVICES_PORTS } from "@app/common/constants/services.contants";

async function bootstrap() {
  process.title = "auth service";
  const app = await NestFactory.create(AuthModule);
  const logger = new Logger("auth service log");
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  await app.listen(SERVICES_PORTS.AUTH_SERVICE);
  logger.log(`Auth microservice running ${SERVICES_PORTS.AUTH_SERVICE}`);
}
bootstrap();
