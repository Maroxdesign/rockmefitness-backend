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
  PROVIDUS: {
    URL: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    PAYMENT_URL: string;
    PAYMENT_USERNAME: string;
    PAYMENT_PASSWORD: string;
    ACCOUNT_NUMBER: string;
  };
  VT_PASS: {
    URL: string;
    USERNAME: string;
    PASSWORD: string;
  };
  SME_PLUG: {
    URL: string;
    PRIVATE_KEY: string;
  };
  SAGE: {
    URL: string;
    USERNAME: string;
    PASSWORD: string;
  };
  SEND_IN_BLUE: {
    KEY: string;
    LIST: number | string;
  };
  KUDA: {
    URL: string;
    KEY: string;
    EMAIL: string;
    ACCOUNT: string;
  };
  DOS: {
    KEY_ID: string;
    SECRET: string;
    BUCKET_NAME: string;
    SPACE_LINK: string;
  };
  DOJAH: {
    URL: string;
    APP_ID: string;
    SECRET_KEY: string;
  };
  FIREBASE: {
    PROJECT_ID: string;
    PRIVATE_KEY: string;
    CLIENT_EMAIL: string;
  };
  SENDGRID: string;
  RELOADLY: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    URL: string;
    AUTH_URL: string;
  };
  SUDO: {
    URL: string;
    API_KEY: string;
  };
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
  PROVIDUS: {
    URL: process.env.PROVIDUS_BASE_URL,
    CLIENT_ID: process.env.PROVIDUS_CLIENT_ID,
    CLIENT_SECRET: process.env.PROVIDUS_CLIENT_SECRET,
    PAYMENT_URL: process.env.PROVIDUS_PAYMENT_URL,
    PAYMENT_USERNAME: process.env.PROVIDUS_PAYMENT_USERNAME,
    PAYMENT_PASSWORD: process.env.PROVIDUS_PAYMENT_PASSWORD,
    ACCOUNT_NUMBER: process.env.PROVIDUS_ACCOUNT_NUMBER,
  },
  VT_PASS: {
    URL: process.env.VT_PASS_URL,
    USERNAME: process.env.VT_PASS_USERNAME,
    PASSWORD: process.env.VT_PASS_PASSWORD,
  },
  SME_PLUG: {
    URL: process.env.SME_PLUG_URL,
    PRIVATE_KEY: process.env.SME_PLUG_PRIVATE_KEY,
  },
  SAGE: {
    URL: process.env.SAGE_URL,
    USERNAME: process.env.SAGE_USERNAME,
    PASSWORD: process.env.SAGE_PASSWORD,
  },
  SEND_IN_BLUE: {
    KEY: process.env.SEND_IN_BLUE,
    LIST: process.env.SEND_IN_BLUE_LIST,
  },
  KUDA: {
    URL: process.env.KUDA_URL,
    KEY: process.env.KUDA_KEY,
    EMAIL: process.env.KUDA_EMAIL,
    ACCOUNT: process.env.KUDA_ACCOUNT,
  },
  DOS: {
    KEY_ID: process.env.DOS_SPACES_KEYID,
    SECRET: process.env.DOS_SPACES_SECRET,
    BUCKET_NAME: process.env.DOS_BUCKET_NAME,
    SPACE_LINK: process.env.DOS_SPACE_LINK,
  },
  DOJAH: {
    URL: process.env.DOJAH_URL,
    APP_ID: process.env.DOJAH_APP_ID,
    SECRET_KEY: process.env.DOJAH_SECRET_KEY,
  },
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  },
  SENDGRID: process.env.SENDGRID_KEY,
  RELOADLY: {
    CLIENT_ID: process.env.RELOADLY_CLIENT_ID,
    CLIENT_SECRET: process.env.RELOADLY_CLIENT_SECRET,
    URL: process.env.RELOADLY_URL,
    AUTH_URL: process.env.RELOADLY_AUTH_URL,
  },
  SUDO: {
    URL: process.env.SUDO_URL,
    API_KEY: process.env.SUDO_API_KEY,
  },
};
