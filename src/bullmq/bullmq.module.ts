import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      prefix: 'azkar-bot',
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: 1000,
        removeOnFail: 1000,
        attempts: 1,
        timestamp: Date.now(),
        keepLogs: 1000,
      },
    }),
  ],
})
export class BullMQModule {}
