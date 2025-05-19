import { stringToBoolean } from "src/utils/string.utils";

// config.ts
export default () => ({
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ?? 3306,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        sync: process.env.DB_SYNC ? stringToBoolean(process.env.DB_SYNC) : false,
      },
    jwt: {
      accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
      accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    },
  });