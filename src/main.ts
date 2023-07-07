import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const port = 4000;
  const app = await NestFactory.create(AppModule);

  logger.log(`app is listening on PORT ${port}`);
  await app.listen(port);
}
bootstrap();
