import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as _cluster from 'cluster';
import { availableParallelism } from 'os';
import * as process from 'process';

const numCPUs = availableParallelism();
const cluster = _cluster as unknown as _cluster.Cluster;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

if (cluster.isPrimary) {
  Logger.log(`Primary process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    Logger.warn(`Worker ${worker.process.pid} exited. Forking a new one...`);
    cluster.fork();
  });
} else {
  bootstrap();
}
