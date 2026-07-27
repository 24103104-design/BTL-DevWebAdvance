import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { SachEntity } from './sach/sach.entity';
import { DocGiaEntity } from './doc-gia/doc-gia.entity';
import { PhieuMuonEntity } from './phieu-muon/phieu-muon.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 14959),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, SachEntity, DocGiaEntity, PhieuMuonEntity],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false,
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  charset: 'utf8mb4_general_ci',
});
