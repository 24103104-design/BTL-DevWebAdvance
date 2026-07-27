import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToUsers20260727120000 implements MigrationInterface {
  name = 'AddRoleToUsers20260727120000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM USERS LIKE 'role'",
    );

    if (!existingColumn) {
      await queryRunner.addColumn(
        'USERS',
        new TableColumn({
          name: 'role',
          type: 'varchar',
          length: '20',
          isNullable: false,
          default: "'user'",
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM USERS LIKE 'role'",
    );

    if (existingColumn) {
      await queryRunner.dropColumn('USERS', 'role');
    }
  }
}
