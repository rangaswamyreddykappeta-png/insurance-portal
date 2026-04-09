import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';

import { User } from './users/entities/user.entity';
import { Policy } from './policies/entities/policy.entity';
import { Claim } from './claims/entities/claim.entity';
import { ClaimDocument } from './claims/entities/claim-document.entity';

import { UsersModule } from './users/users.module';
import { ClaimsModule } from './claims/claims.module';
import { PolicesModule } from './polices/polices.module';
import { AuthModule } from './auth/auth.module';

import { ClaimReview } from './claims/entities/claim-review.entity';
import { ClaimActivityLog } from './claims/entities/claim-activity-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: parseInt(configService.get<string>('POSTGRES_PORT') || '5432', 10),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    autoLoadEntities: true,
    synchronize: true,
    ssl: configService.get<string>('POSTGRES_HOST')?.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : false,
  }),
}),
    UsersModule,
    ClaimsModule,
    PolicesModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}