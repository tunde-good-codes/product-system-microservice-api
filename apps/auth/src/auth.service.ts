import { JwtService } from "@nestjs/jwt";
import { KAFKA_SERVICE } from "@app/kafka";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user-dto";
import * as bcrypt from "bcryptjs";
import { KAFKA_TOPICS } from "@app/kafka/constants/kafka.topics";
import { LoginDto } from "./dto/login.dto";
import { randomBytes } from "crypto";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword
      });

      await this.userRepository.save(user);

      const tokens = await this.generateToken(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
        name: user.name,
        email: user.name,
        id: user.id
      });
      const { password, ...safeUser } = user;
      return {
        success: true,
        message: "user registered successfully",
        data: safeUser
      };
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new BadRequestException("Unexpected error");
    }
  }

  async loginUser(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          refreshToken: true
        }
      });

      if (!user) {
        throw new ConflictException("invalid email or password");
      }

      const isPassword = await bcrypt.compare(loginDto.password, user.password);

      if (!isPassword) {
        throw new ConflictException("invalid email or password");
      }

      const { accessToken, refreshToken } = await this.generateToken(user.id, user.email);
      await this.updateRefreshToken(user.id, refreshToken);

      const { password, ...safeUser } = user;
      return {
        success: true,
        message: "sign-in successfully",
        accessToken,
        refreshToken,
        data: safeUser
      };
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new BadRequestException("Request Timed Out");
    }
  }

  async getHello() {
    return "hello";
  }
  private async generateToken(
    userId: string,
    email: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };
    const refreshId = randomBytes(16).toString("hex");

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.getOrThrow("JWT_EXPIRES_IN"),

        secret: this.configService.getOrThrow<string>("JWT_SECRET")
      }),

      this.jwtService.signAsync(
        { ...payload, refreshId },
        {
          secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET")
        }
      )
    ]);

    return { accessToken, refreshToken };
  }

  async getUserProfile(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      });

      if (!user) {
        throw new UnauthorizedException("no user found with this id");
      }

      return {
        success: true,
        user
      };
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new BadRequestException(e);
    }
  }
  async getOneUserById(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("user not found");
    }

    return {
      success: true,
      user
    };
  }
  private async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(
      {
        id: userId
      },
      {
        refreshToken
      }
    );
  }
}
