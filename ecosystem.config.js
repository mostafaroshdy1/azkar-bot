module.exports = {
  apps: [
    {
      name: 'azkar-bot',
      script: 'index.ts',
      cwd: '~/apps/azkar-bot',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/azkar-bot/error.log',
      out_file: '/var/log/azkar-bot/output.log',
      autorestart: true,
    },
  ],
};
