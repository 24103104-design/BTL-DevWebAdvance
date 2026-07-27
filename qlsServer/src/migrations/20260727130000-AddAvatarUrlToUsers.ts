import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarUrlToUsers20260727130000 implements MigrationInterface {
  name = 'AddAvatarUrlToUsers20260727130000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM USERS LIKE 'avatarUrl'",
    );

    if (!existingColumn) {
      await queryRunner.addColumn(
        'USERS',
        new TableColumn({
          name: 'avatarUrl',
          type: 'varchar',
          length: '255',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const [existingColumn] = await queryRunner.query(
      "SHOW COLUMNS FROM USERS LIKE 'avatarUrl'",
    );

    if (existingColumn) {
      await queryRunner.dropColumn('USERS', 'avatarUrl');
    }
  }
}
