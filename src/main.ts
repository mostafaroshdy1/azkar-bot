import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function bootstrap() {
  NestFactory.createApplicationContext(AppModule);
}
bootstrap();
