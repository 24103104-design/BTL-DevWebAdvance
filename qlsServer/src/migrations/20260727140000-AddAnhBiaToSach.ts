import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnhBiaToSach20260727140000 implements MigrationInterface {
  name = 'AddAnhBiaToSach20260727140000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM SACH LIKE 'AnhBia'",
    );

    if (!existingColumn) {
      await queryRunner.addColumn(
        'SACH',
        new TableColumn({
          name: 'AnhBia',
          type: 'text',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM SACH LIKE 'AnhBia'",
    );

    if (existingColumn) {
      await queryRunner.dropColumn('SACH', 'AnhBia');
    }
  }
}
