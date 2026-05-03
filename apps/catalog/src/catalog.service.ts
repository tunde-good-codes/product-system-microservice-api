import { KAFKA_SERVICE } from "@app/kafka";
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class CatalogService implements OnModuleInit {
  constructor(@Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka) {}
  logger = new Logger();

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log("catalog service connected to kafka");
  }
  ping() {
    return {
      ok: true,
      service: "catalog",
      now: new Date().toISOString()
    };
  }

  getHello(){
    return "hello Tunde!"
  }
}
