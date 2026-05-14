import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProductCreatedEvent } from "../product/product.events";
import { firstValueFrom } from "rxjs";
import { KAFKA_TOPICS } from "@app/kafka/constants/kafka.topics";

@Injectable()
export class ProductEventPublisher implements OnModuleInit {
  constructor(
    @Inject("catalog-service-group")
    private readonly searchEventClient: ClientProxy
  ) {}

  private readonly logger = new Logger("product publisher event");

  async onModuleInit() {
    await this.searchEventClient.connect();
  }

  async productCreated(event: ProductCreatedEvent) {
    try {
      const product = await firstValueFrom(
        this.searchEventClient.emit(KAFKA_TOPICS.PRODUCT_CREATED, event)
      );

      console.log(`event is now logging here: ` + product);
      
    } catch (error) {
      this.logger.warn("product creation event fails here");
    }
  }
}
