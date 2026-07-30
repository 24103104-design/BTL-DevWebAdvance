import 'dotenv/config';
import { AppDataSource } from './data-source';

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('DataSource initialized. Running migrations...');
    const result = await AppDataSource.runMigrations();
    console.log('Migrations applied:', result.map(r => r.name));
    await AppDataSource.destroy();
    process.exit(0);
  } catch (err) {
    console.error('Failed to run migrations', err);
    process.exit(1);
  }
}

run();
