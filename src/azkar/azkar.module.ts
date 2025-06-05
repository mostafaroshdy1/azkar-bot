import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { AzkarProcessor } from './azkar.processor';
import { AzkarService } from './azkar.service';
import { BullMQModule } from 'src/bullmq/bullmq.module';
@Module({
  imports: [
    BullMQModule,
    BullModule.registerQueue({
      name: 'azkar',
    }),
  ],
  providers: [AzkarService, AzkarProcessor],
})
export class AzkarModule {}
