import { SERVICES_PORTS } from "@app/common/constants/services.contants";
import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CatalogService {
  private readonly catalogServiceUrl = `http:localhost:${SERVICES_PORTS.CATALOG_SERVICE}`;

  constructor(private readonly httpService: HttpService) {}

  async getHello() {
    try {
      const response = await firstValueFrom(this.httpService.get(`${this.catalogServiceUrl}/catalog`));

      return response.data;
    } catch (e) {
      this.handleError(e);
    }
  }

  private handleError(error: unknown): never {
    const err = error as {
      response?: { data: string | object; status: number };
    };
    if (err.response) {
      throw new HttpException(err.response.data, err.response.status);
    }
    throw new HttpException("Something went wrong", 503);
  }
}
