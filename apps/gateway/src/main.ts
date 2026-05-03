import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { GatewayModule } from "./gateway.module";

async function bootstrap() {
  process.title = "gateway";
  const app = await NestFactory.create(GatewayModule);
  app.enableShutdownHooks();
  const logger = new Logger("gateway logger");

  const port = Number(process.env.GATEWAY_PORT ?? 3000);
  app.enableCors({
    origin: ["http://localhost:3000", "https://localhost:3000", "http://mydomain.com"],

    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  await app.listen(port);
  logger.log(`Gateway running on port: ${port} `);
}
bootstrap();
