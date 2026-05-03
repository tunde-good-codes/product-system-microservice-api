import { NestFactory } from "@nestjs/core";
import { CatalogModule } from "./catalog.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SERVICES_PORTS } from "@app/common/constants/services.contants";

async function bootstrap() {
  process.title = "catalog";
  const logger = new Logger("catalog-service");

  const app = await NestFactory.create(CatalogModule);

  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );
  await app.listen(SERVICES_PORTS.CATALOG_SERVICE);
  logger.log(`catalog service running on port: ${SERVICES_PORTS.CATALOG_SERVICE} `);
}
bootstrap();
