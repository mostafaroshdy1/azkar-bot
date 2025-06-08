import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Telegraf } from 'telegraf';

@Injectable()
export class AzkarService implements OnModuleInit {
  constructor(@InjectQueue('azkar') private readonly azkarQueue: Queue) {}

  private readonly logger = new Logger(AzkarService.name, { timestamp: true });

  public readonly bot: Telegraf = new Telegraf(process.env.BOT_TOKEN!);

  async onModuleInit() {
    this.initializeBot();
    this.botStartCommand();
    this.setAzkarInterval();
    this.stopAzkarBot();
  }

  async scheduleUser(userId: number, durationInMs: number) {
    await this.cancelUserSchedule(`${userId}`);
    return this.azkarQueue.upsertJobScheduler(`${userId}`, {
      every: durationInMs,
      startDate: Date.now() + durationInMs,
    });
  }

  cancelUserSchedule(userId: string) {
    return this.azkarQueue.removeJobScheduler(userId);
  }

  private initializeBot() {
    this.bot.telegram
      .setMyCommands([
        {
          command: 'start',
          description: 'ابدأ استقبال الأذكار (كل ٣٠ دقيقة بشكل افتراضي)',
        },
        {
          command: 'set',
          description: 'تغيير الفترة الزمنية بين الأذكار (مثال: set 10/)',
        },
        {
          command: 'stop',
          description: 'إيقاف إرسال الأذكار',
        },
      ])
      .then(() => this.logger.log('Commands set successfully'))
      .catch((err) => this.logger.error('Error setting commands', err));

    this.bot
      .launch()
      .then(() => this.logger.log('Bot launched successfully'))
      .catch((err) => this.logger.error('Error launching bot', err));
  }

  private botStartCommand() {
    this.bot.start(async (ctx) => {
      const userId = ctx.from?.id;
      const defaultDurationInMs = 1000 * 60 * 30; // 30 minutes in milliseconds

      if (!userId) {
        this.logger.warn('Received /start command without a valid user ID.');
        return;
      }

      try {
        await this.scheduleUser(userId, defaultDurationInMs);
        this.logger.log(`User ${userId} scheduled with default duration.`);
      } catch (scheduleError) {
        this.logger.error(
          `Failed to schedule Azkar for user ${userId}: ${scheduleError.message}`,
          scheduleError.stack,
        );

        try {
          await ctx.reply(
            '❌ حدث خطأ أثناء إعداد الأذكار. الرجاء المحاولة لاحقًا أو تواصل مع @benroshdy',
          );
        } catch (replyError) {
          this.logger.error(
            `Failed to send error message to user ${userId}: ${replyError.message}`,
            replyError.stack,
          );
        }

        return;
      }

      try {
        await ctx.reply(
          '📿 مرحبًا! ستصلك الأذكار كل ٣٠ دقيقة بشكل افتراضي.\n\nيمكنك تغيير الوقت في أي وقت باستخدام الأمر:\n/set <عدد الدقائق>\nمثال: set 10/',
        );
      } catch (welcomeError) {
        this.logger.error(
          `Failed to send welcome message to user ${userId}: ${welcomeError.message}`,
          welcomeError.stack,
        );
      }
    });
  }

  private setAzkarInterval() {
    this.bot.command('set', async (ctx) => {
      const userId = ctx.from?.id;

      if (!userId) {
        this.logger.warn('Received /set command without a valid user ID.');
        return;
      }

      const parts = ctx.message.text.trim().split(' ');
      const minutes = parseFloat(parts[1]);

      if (isNaN(minutes) || minutes < 5) {
        try {
          await ctx.reply(
            '❌ الرجاء إدخال عدد دقائق صالح (5 دقائق على الأقل). مثال: set 15/',
          );
        } catch (replyError) {
          this.logger.error(
            `Failed to send invalid input message to user ${userId}: ${replyError.message}`,
            replyError.stack,
          );
        }
        return;
      }

      const durationInMs = minutes * 60 * 1000;

      try {
        await this.scheduleUser(userId, durationInMs);
        this.logger.log(
          `User ${userId} scheduled with custom duration: ${minutes} minutes`,
        );
        try {
          await ctx.reply(`✅ سيتم إرسال الأذكار لك كل ${minutes} دقيقة.`);
        } catch (replySuccessError) {
          this.logger.error(
            `Failed to send success message to user ${userId}: ${replySuccessError.message}`,
            replySuccessError.stack,
          );
        }
      } catch (scheduleError) {
        this.logger.error(
          `Error scheduling user ${userId} with custom duration: ${scheduleError.message}`,
          scheduleError.stack,
        );
        try {
          await ctx.reply(
            '❌ حدث خطأ أثناء تحديث الجدولة. الرجاء المحاولة لاحقًا أو تواصل مع @benroshdy',
          );
        } catch (replyError) {
          this.logger.error(
            `Failed to send error message to user ${userId}: ${replyError.message}`,
            replyError.stack,
          );
        }
      }
    });
  }

  private stopAzkarBot() {
    this.bot.command('stop', async (ctx) => {
      const userId = ctx.from?.id;

      if (!userId) {
        this.logger.warn('Received /stop command without a valid user ID.');
        return;
      }

      try {
        await this.cancelUserSchedule(`${userId}`);
        this.logger.log(`User ${userId} scheduled cancelled successfully.`);
        try {
          await ctx.reply('🛑 تم إيقاف إرسال الأذكار.');
        } catch (replyError) {
          this.logger.error(
            `Failed to send stop confirmation to user ${userId}: ${replyError.message}`,
            replyError.stack,
          );
        }
      } catch (cancelError) {
        this.logger.error(
          `Error cancelling schedule for user ${userId}: ${cancelError.message}`,
          cancelError.stack,
        );
        try {
          await ctx.reply(
            '❌ حدث خطأ أثناء محاولة إيقاف الأذكار. الرجاء المحاولة لاحقًا أو تواصل مع @benroshdy',
          );
        } catch (replyError) {
          this.logger.error(
            `Failed to send error message to user ${userId}: ${replyError.message}`,
            replyError.stack,
          );
        }
      }
    });
  }
}
