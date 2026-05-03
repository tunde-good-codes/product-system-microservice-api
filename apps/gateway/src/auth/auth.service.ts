import { SERVICES_PORTS } from "@app/common/constants/services.contants";
import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { first, firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  private readonly authServer = `http://localhost:${SERVICES_PORTS.AUTH_SERVICE}/auth`;

  constructor(private readonly httpService: HttpService) {}

  async createUser(data: { email: string; password: string; name: string }) {
    try {
      const result = await firstValueFrom(
        this.httpService.post(`${this.authServer}/register`, data)
      );

      return result.data;
    } catch (e) {
      this.handleError(e);
    }
  }

  async loginUser(data: { email: string; password: string }) {
    try {
      const result = await firstValueFrom(this.httpService.post(`${this.authServer}/login`, data));
      return result.data;
    } catch (e) {
      this.handleError(e);
    }
  }

  async getHello() {
    try {
      const result = await firstValueFrom(this.httpService.get(`${this.authServer}`));
      if (!result) {
        return "error";
      }
      return result.data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUserProfile(authHeader: string) {

    try {
      const result = await firstValueFrom(
        this.httpService.get(`${this.authServer}/profile`, {
          headers: {
            Authorization: authHeader
          }
        })
      );

      return result.data;
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
