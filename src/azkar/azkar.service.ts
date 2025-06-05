import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Telegraf } from 'telegraf';

@Injectable()
export class AzkarService implements OnModuleInit {
  constructor(@InjectQueue('azkar') private readonly azkarQueue: Queue) {}

  public readonly bot: Telegraf = new Telegraf(process.env.BOT_TOKEN!);

  async onModuleInit() {
    console.log('AzkarService initialized', process.env.BOT_TOKEN);
    await this.bot.telegram.setMyCommands([
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
    ]);

    this.bot
      .launch()
      .then(() => console.log('Bot launched successfully'))
      .catch((err) => console.error('Failed to launch bot:', err));

    this.bot.start(async (ctx) => {
      const userId = ctx.from.id;
      const defaultDurationInMs = 30 * 60 * 1000;

      await this.scheduleUser(userId, defaultDurationInMs);

      ctx.reply(
        '📿 مرحبًا! ستصلك الأذكار كل ٣٠ دقيقة بشكل افتراضي.\n\nيمكنك تغيير الوقت في أي وقت باستخدام الأمر:\n/set <عدد الدقائق>\nمثال: set 10/',
      );
    });

    this.bot.command('set', async (ctx) => {
      const parts = ctx.message.text.split(' ');
      const minutes = parseInt(parts[1], 10);
      if (isNaN(minutes) || minutes < 1) {
        return ctx.reply('❌ الرجاء إدخال عدد دقائق صالح. مثال: set 15/');
      }
      const durationInMs = minutes * 60 * 1000;
      const userId = ctx.from.id;
      await this.scheduleUser(userId, durationInMs);
      ctx.reply(`✅ سيتم إرسال الأذكار لك كل ${minutes} دقيقة.`);
    });

    this.bot.command('stop', async (ctx) => {
      const userId = ctx.from.id;
      await this.cancelUserSchedule(`${userId}`);
      ctx.reply('🛑 تم إيقاف إرسال الأذكار.');
    });
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
}
