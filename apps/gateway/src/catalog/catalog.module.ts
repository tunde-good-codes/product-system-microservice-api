import { HttpModule } from "@nestjs/axios";
import { CatalogService } from "./catalog.service";
import { CatalogController } from "./catalog.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [HttpModule],
  providers: [CatalogService],
  controllers: [CatalogController]
})
export class CatalogModule {}
