/**
 * pm2 명령어 예시
 *
 * pm2 start ecosystem.config.js --only nklcb-dev
 * pm2 restart ecosystem.config.js --only nklcb-prod
 * pm2 list
 * pm2 stop nklcb-dev
 * pm2 delete nklcb-test
 * pm2 save (서버 재부팅 시 자동 복원)
 *
 */
module.exports = {
  apps: [
    {
      name: 'nklcb-dev',
      script: 'npm',
      args: 'run start:dev',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'nklcb-prod',
      script: 'npm',
      args: 'run start:prod',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'nklcb-build',
      script: 'npm',
      args: 'run build',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'nklcb-test',
      script: 'npm',
      args: 'run test',
      env: {
        NODE_ENV: 'test',
      },
    },
  ],
};
