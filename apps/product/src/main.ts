import { KAFKA_BROKER } from "./../../../libs/kafka/src/constants/kafka.topics";
import { NestFactory } from "@nestjs/core";
import { ProductModule } from "./product.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SERVICES_PORTS } from "@app/common/constants/services.contants";
import { Transport } from "@nestjs/microservices";
import { options } from "axios";

async function bootstrap() {
  process.title = "product service";
  const logger = new Logger("product logging service");
  const app = await NestFactory.create(ProductModule);
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER]
      },
      consumer: {
        groupId: "product-service-group"
      }
    }
  });
    await app.startAllMicroservices();

  await app.listen(SERVICES_PORTS.PRODUCTS_SERVICE);

  logger.log(`product service running on port: ${SERVICES_PORTS.PRODUCTS_SERVICE}`);
}
bootstrap();
