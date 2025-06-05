import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { azkar } from './azkar';
import { AzkarService } from './azkar.service';

@Processor('azkar', {
  concurrency: 20,
  limiter: { max: 30, duration: 1000 * 30 },
})
export class AzkarProcessor extends WorkerHost {
  constructor(private readonly azkarService: AzkarService) {
    super();
  }
  process(job: Job) {
    return this.handleAzkarJob(job.repeatJobKey as string);
  }

  async handleAzkarJob(userId: string): Promise<void> {
    const azkar = this.getRandomAzkar();

    try {
      await this.azkarService.bot.telegram.sendMessage(userId, azkar);
    } catch (err: any) {
      console.error(`Failed to send Azkar to ${userId}:`, err);

      // Optional: remove user from DB if they blocked the bot
      if (err?.response?.error_code === 403) {
        await this.azkarService.cancelUserSchedule(userId);
      }
    }
  }

  getRandomAzkar(): string {
    return azkar[Math.floor(Math.random() * azkar.length)];
  }
}
