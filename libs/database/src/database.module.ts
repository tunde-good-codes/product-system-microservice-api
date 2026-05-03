import { Module, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getDatabaseConfig } from "./database.config";

@Module({
  imports: [TypeOrmModule.forRootAsync({
  useFactory: async () => {
    const config = getDatabaseConfig();

    const logger = new Logger('Database');

    logger.log('Connecting to PostgreSQL...');

    if (config.type === 'postgres') {
      logger.log(
        `DB: ${config.database} @ ${config.host}:${config.port}`,
      );
    }

    return config;
  },
})]
})
export class DatabaseModule {}
