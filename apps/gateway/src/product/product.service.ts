import { SERVICES_PORTS } from "@app/common/constants/services.contants";
import { HttpService } from "@nestjs/axios";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductDataContext } from "apps/product/src/dto/product.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProductService {
  private readonly productServiceUrl = `http://localhost:${SERVICES_PORTS.PRODUCTS_SERVICE}`;
  constructor(private readonly httpService: HttpService) {}

  async createProduct(data: ProductDataContext, authHeader: string) {
    try {
      const result = await firstValueFrom(
        this.httpService.post(`${this.productServiceUrl}/products`, data, {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json"
          }
        })
      );

      return result.data;
    } catch (error) {
        console.log(error.response.data); 

      throw new BadRequestException(error);
    }
  }

  async getAllProduct(authToken:string){
    try {
      const result = await firstValueFrom(this.httpService.get(`${this.productServiceUrl}/products`, {
        headers:{
          Authorization:authToken
        }
      }))

      return result.data
    } catch (error) {
      throw new NotFoundException(error)
    }
  }
}
