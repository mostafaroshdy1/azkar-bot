import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AzkarService {
  constructor(@InjectQueue('azkar') private readonly azkarQueue: Queue) {}

  scheduleUser(userId: number, durationInMs: number) {
    return this.azkarQueue.upsertJobScheduler(`azkar:${userId}`, {
      every: durationInMs,
    });
  }

  cancelUserSchedule(userId: number) {
    return this.azkarQueue.removeJobScheduler(`azkar:${userId}`);
  }
}
