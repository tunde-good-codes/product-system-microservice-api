import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "apps/auth/src/entities/users.entity";
import { Product } from "apps/product/src/entity/product.entity";

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',

  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),

  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'blog_posting_db',

  autoLoadEntities: true,
  entities:[User, Product],
  synchronize: true});