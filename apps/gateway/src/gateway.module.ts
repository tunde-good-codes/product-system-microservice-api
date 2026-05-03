import { Module } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { GatewayService } from "./gateway.service";
import { CatalogModule } from "./catalog/catalog.module";
import { AuthModule } from "./auth/auth.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { DatabaseModule } from "@app/database";
import { ProductModule } from "./product/product.module";

@Module({
  imports: [
    CatalogModule,
    ProductModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: { expiresIn: "1d" }
    })
  ],
  controllers: [GatewayController],
  providers: [GatewayService, JwtService]
})
export class GatewayModule {}
