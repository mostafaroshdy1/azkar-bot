# [Azkar Bot](https://t.me/azkar_dailybot)

Azkar Bot is a high-concurrency Telegram bot designed to deliver Islamic Azkar (remembrances) efficiently and reliably.

## Features

- **High Concurrency:** Built to handle multiple user requests simultaneously without performance degradation.
- **Redis & BullMQ:** Utilizes Redis as a fast in-memory data store and BullMQ for robust, scalable job queueing and task processing.
- **Rate Limiting:** Implements rate limiting to ensure fair use and prevent abuse or spam.
- **Reliable & Scalable:** Designed for production with scalability in mind, using proven technologies to maintain stability under load.

## Architecture

- **Redis:** Stores temporary data and manages state for high-speed access.
- **BullMQ:** Queues user tasks and manages job concurrency.
- **Rate Limiter:** Controlled concurrency to maintian the allowed telegram's rate limit.
