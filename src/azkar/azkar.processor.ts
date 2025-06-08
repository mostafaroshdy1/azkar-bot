import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { azkar } from './azkar';
import { AzkarService } from './azkar.service';
import { Logger, OnModuleInit } from '@nestjs/common';

@Processor('azkar', {
  concurrency: 20,
  limiter: { max: 30, duration: 1000 * 30 },
})
export class AzkarProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(AzkarProcessor.name, {
    timestamp: true,
  });

  onModuleInit() {
    this.worker.on('error', (error: Error) => {
      this.logger.error('AzkarProcessor encountered an error', error);
    });
  }

  constructor(private readonly azkarService: AzkarService) {
    super();
  }

  process(job: Job) {
    return this.handleAzkarJob(job.repeatJobKey as string);
  }

  private async handleAzkarJob(userId: string): Promise<void> {
    const azkar = this.getRandomAzkar();

    try {
      await this.azkarService.bot.telegram.sendMessage(userId, azkar);
      this.logger.log(`Azkar sent to userId: ${userId} successfully.`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send Azkar to userId: ${userId} , error message: ${error.message}`,
        error.stack,
      );

      if (error?.response?.error_code === 403) {
        await this.azkarService.cancelUserSchedule(userId);
        this.logger.log(
          `User with ID ${userId} has blocked the bot or left the chat. Schedule cancelled.`,
        );
      }
    }
  }

  private getRandomAzkar(): string {
    return azkar[Math.floor(Math.random() * azkar.length)];
  }
}
