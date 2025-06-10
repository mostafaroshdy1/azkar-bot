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

## High-Level Architecture
![image](https://github.com/user-attachments/assets/225e9434-4c1d-495f-a2b1-3739377d27b0)

## Core Component Relationships
![image](https://github.com/user-attachments/assets/d16b9277-4768-4a90-8b24-ea75a71f9a3b)

## Message Processing Flow
![image](https://github.com/user-attachments/assets/8a82e077-58f2-4f63-bca5-3626cf99d49c)


