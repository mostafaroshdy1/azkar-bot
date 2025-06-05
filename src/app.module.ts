import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzkarModule } from './azkar/azkar.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      skipProcessEnv: false,
    }),
    AzkarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
