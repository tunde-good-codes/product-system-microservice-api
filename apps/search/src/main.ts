import { KAFKA_BROKER } from "./../../../libs/kafka/src/constants/kafka.topics";
import { NestFactory } from "@nestjs/core";
import { SearchModule } from "./search.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const logger = new Logger("search service staring");
  const app = await NestFactory.create(SearchModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        broker: [process.env.KAFKA_BROKER]
      }, consumer:{
        groupId:"search service consumer"
      }
    }
  });

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
