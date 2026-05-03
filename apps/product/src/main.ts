import { NestFactory } from "@nestjs/core";
import { ProductModule } from "./product.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SERVICES_PORTS } from "@app/common/constants/services.contants";

async function bootstrap() {
  process.title = "product service";
  const logger = new Logger("product logging service");
  const app = await NestFactory.create(ProductModule);
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  await app.listen(SERVICES_PORTS.PRODUCTS_SERVICE);

  logger.log(`product service running on port: ${SERVICES_PORTS.PRODUCTS_SERVICE}`);
}
bootstrap();
