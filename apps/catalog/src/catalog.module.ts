import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { KafkaModule } from "@app/kafka";

@Module({
  imports: [KafkaModule.register("catalog-service-group")],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
