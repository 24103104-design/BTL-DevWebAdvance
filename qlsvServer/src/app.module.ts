import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// IMPORT ĐẦY ĐỦ CÁC MODULE CON
import { BookModule } from './book/book.module';
import { SachModule } from './sach/sach.module';
import { DocGiaModule } from './doc-gia/doc-gia.module';
import { PhieuMuonModule } from './phieu-muon/phieu-muon.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-2c69a825-st-a1a9.d.aivencloud.com',
      port: 11563,
      username: 'avnadmin',
      password: process.env.DB_PASSWORD,
      database: 'defaultdb',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    BookModule,
    SachModule,
    DocGiaModule,
    PhieuMuonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}