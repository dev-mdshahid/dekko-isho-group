// pm2 entry for the careers API on the RPA droplet (159.223.50.93).
// Start once with `pm2 start ecosystem.config.cjs && pm2 save`; later deploys use `npm run deploy:api`.
module.exports = {
  apps: [
    {
      name: 'dekkoisho-website-api',
      cwd: __dirname + '/apps/api',
      script: 'dist/src/server.js',
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '400M',
      kill_timeout: 10000,
      env: {
        NODE_ENV: 'production',
      },
      time: true,
    },
  ],
}
