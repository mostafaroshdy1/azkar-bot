module.exports = {
  apps: [
    {
      name: 'azkar-bot',
      script: '/home/mostafaroshdy1/apps/azkar-bot/dist/main.js',
      cwd: '/home/mostafaroshdy1/apps/azkar-bot',
      exec_mode: 'cluster',
      instances: 2,
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/azkar-bot/error.log',
      out_file: '/var/log/azkar-bot/output.log',
      autorestart: true,
      restart_delay: 5000,
    },
  ],
};
