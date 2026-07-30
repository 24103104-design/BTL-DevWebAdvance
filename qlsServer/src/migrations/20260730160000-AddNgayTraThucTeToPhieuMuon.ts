import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNgayTraThucTeToPhieuMuon20260730160000 implements MigrationInterface {
  name = 'AddNgayTraThucTeToPhieuMuon20260730160000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM PHIEU_MUON LIKE 'NgayTraThucTe'",
    );

    if (!existingColumn) {
      await queryRunner.addColumn(
        'PHIEU_MUON',
        new TableColumn({
          name: 'NgayTraThucTe',
          type: 'date',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM PHIEU_MUON LIKE 'NgayTraThucTe'",
    );

    if (existingColumn) {
      await queryRunner.dropColumn('PHIEU_MUON', 'NgayTraThucTe');
    }
  }
}
