import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Seeder } from './database/seeders/seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(Seeder);
  await seeder.run();
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeder failed!', err);
  process.exit(1);
});
