import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

interface IEnvironment {
  APP: {
    NAME: string;
    PORT: number | string;
    ENV: string;
    EMAIL: string;
  };
  JWT: {
    SECRET: string;
  };
  REDIS: {
    URL: string;
  };
  EMAIL: {
    SERVICE: string;
    USERNAME: string;
    PASSWORD: string;
  };
  DB: {
    URL: string;
  };
  SME_PLUG: {
    URL: string;
    PRIVATE_KEY: string;
  };
  SEND_IN_BLUE: {
    KEY: string;
    LIST: number | string;
  };
  DOS: {
    KEY_ID: string;
    SECRET: string;
    BUCKET_NAME: string;
    SPACE_LINK: string;
  };
  SENDGRID: string;
}

export const environment: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    ENV: process.env.APP_ENV,
    EMAIL: process.env.EMAIL,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
  REDIS: {
    URL: process.env.REDIS_URL,
  },
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE,
    USERNAME: process.env.EMAIL_USERNAME,
    PASSWORD: process.env.EMAIL_PASSWORD,
  },
  DB: {
    URL: process.env.DB_URL,
  },
  SME_PLUG: {
    URL: process.env.SME_PLUG_URL,
    PRIVATE_KEY: process.env.SME_PLUG_PRIVATE_KEY,
  },
  SEND_IN_BLUE: {
    KEY: process.env.SEND_IN_BLUE,
    LIST: process.env.SEND_IN_BLUE_LIST,
  },
  DOS: {
    KEY_ID: process.env.DOS_SPACES_KEYID,
    SECRET: process.env.DOS_SPACES_SECRET,
    BUCKET_NAME: process.env.DOS_BUCKET_NAME,
    SPACE_LINK: process.env.DOS_SPACE_LINK,
  },
  SENDGRID: process.env.SENDGRID_KEY,
};
