import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// IMPORT ĐẦY ĐỦ CÁC MODULE CON
import { SachModule } from './sach/sach.module';
import { DocGiaModule } from './doc-gia/doc-gia.module';
import { PhieuMuonModule } from './phieu-muon/phieu-muon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT') ?? 14959),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        ssl:
          configService.get<string>('DB_SSL') === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : false,
        charset: 'utf8mb4_general_ci',
      }),
    }),
    SachModule,
    DocGiaModule,
    PhieuMuonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}