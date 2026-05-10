import { SERVICES_PORTS } from "@app/common/constants/services.contants";
import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { ProductDataContext } from "apps/product/src/dto/product.dto";
import { firstValueFrom } from "rxjs";
import FormData from "form-data";

@Injectable()
export class ProductService {
  private readonly productServiceUrl = `http://localhost:${SERVICES_PORTS.PRODUCTS_SERVICE}`;
  constructor(private readonly httpService: HttpService) {}

  async createProduct(
    data: ProductDataContext,
    file: Express.Multer.File | undefined,
    authHeader: string
  ) {
    try {
      const form = new FormData();

      // Append all text fields
      form.append("name", data.name);
      form.append("price", String(data.price));
      if (data.description) form.append("description", data.description);
      if (data.status) form.append("status", data.status);

      // Append the file if it exists
      if (file) {
        form.append("image", file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      }

      const result = await firstValueFrom(
        this.httpService.post(`${this.productServiceUrl}/products`, form, {
          headers: {
            Authorization: authHeader,
            ...form.getHeaders() // ← this sets the correct Content-Type with boundary
          }
        })
      );
      return result.data;
    } catch (error) {
      console.log(error.response?.data);
      throw new BadRequestException(error.response?.data || error.message);
    }
  }

  async getAllProduct(authToken: string) {
    try {
      const result = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products`, {
          headers: {
            Authorization: authToken
          }
        })
      );

      return result.data;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getSingleProduct(productId: string) {
    try {
      const product = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${productId}`)
      );
      return product.data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
