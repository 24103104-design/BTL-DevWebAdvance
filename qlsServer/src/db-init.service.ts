import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbInitService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    console.log('--- Checking for role column in USERS table ---');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const columns = await queryRunner.query(
        "SHOW COLUMNS FROM USERS LIKE 'role'",
      );
      if (columns.length === 0) {
        console.log('Adding role column to USERS table...');
        await queryRunner.query(
          "ALTER TABLE USERS ADD COLUMN role VARCHAR(20) DEFAULT 'user'",
        );
        console.log('Column role added successfully.');
      } else {
        console.log('Column role already exists.');
      }

      console.log('--- Checking for NgayTraThucTe column in PHIEU_MUON table ---');
      const phieuMuonColumns = await queryRunner.query("SHOW COLUMNS FROM PHIEU_MUON LIKE 'NgayTraThucTe'");
      if (phieuMuonColumns.length === 0) {
        console.log('Adding NgayTraThucTe column to PHIEU_MUON table...');
        await queryRunner.query('ALTER TABLE PHIEU_MUON ADD COLUMN NgayTraThucTe DATE NULL');
        console.log('Column NgayTraThucTe added successfully.');
      } else {
        console.log('Column NgayTraThucTe already exists.');
      }

      console.log('--- Checking sample reader names in DOC_GIA table ---');
      await queryRunner.query(
        "UPDATE DOC_GIA SET HoTen = 'Nguyễn Huy Kiên' WHERE HoTen = 'Nguyen Huy Kien'",
      );
      console.log('Sample reader name update completed if applicable.');
    } catch (error) {
      console.error(
        'Error while checking/adding role column or seeding DOC_GIA:',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
