import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN!);

@Processor('azkar')
export class AzkarProcessor {
  async handleAzkarJob(job: Job<{ userId: number }>) {
    const { userId } = job.data;
    const azkar = getRandomAzkar();

    if (!azkar) {
      console.warn(`No Azkar found for user ${userId}`);
      return;
    }

    try {
      await bot.telegram.sendMessage(userId, azkar);
    } catch (err: any) {
      console.error(`Failed to send Azkar to ${userId}:`, err?.message);

      // Optional: remove user from DB if they blocked the bot
      if (
        err?.response?.error_code === 403 &&
        err?.response?.description?.includes('bot was blocked by the user')
      ) {
        console.log(
          `User ${userId} blocked the bot. You may want to remove them.`,
        );
        // db.run("DELETE FROM users WHERE id = ?", [userId]); // if using sqlite like your original code
      }
    }
  }
}
