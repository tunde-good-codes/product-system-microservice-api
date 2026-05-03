import { GatewayService } from "./gateway.service";
import { Controller, Get, Inject } from "@nestjs/common";


@Controller()
export class GatewayController {
  constructor() {}

  @Get("health")
  async getHello() {
    return {
      ok: true,
      service: "Gateway",
      date: new Date().toDateString()
    };
  }
}
