const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');


const envFile = path.join(process.cwd(), '.env')
dotenv.config({ path: envFile });

console.log('env file', envFile)

// dotenv.config()

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    DEFAULT_PASSWORD: Joi.string().required().description('Defaul password'),
    FACEBOOK_API_KEY: Joi.string().required().description('Facebook config'),
    FACEBOOK_API_SECRET: Joi.string().required().description('Facebook config'),
    FACEBOOK_CALLBACK_URL: Joi.string().required().description('Facebook config'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    EASY_SHIP_API_KEY: Joi.string().description('Sanbox easyship key'),
    CLIENT_URL: Joi.string().description('Client return url'),
    PAYPAL_CLIENT_ID: Joi.string().description('Paypal client id'),
    PAYPAL_SECRET: Joi.string().description('Paypal secret'),
    SPOTIFY_CLIENT_ID: Joi.string().description('Spotify client id'),
    SPOTIFY_CLIENT_SECRET: Joi.string().description('Spotify secret'),
    SPOTIFY_REDIRECT: Joi.string().description('Spotify redirect url'),
    SHOULD_COMPRESS_GLB: Joi.string().description(`Should/ Shouldn't compress glb file when upload`),
    SHOULD_COMPRESS_IMAGE: Joi.string().description(`Should/ Shouldn't compress image file when upload`),
    SERVER_URL: Joi.string().description('Server url'),
    DATABASE_NAME: Joi.string().description('MongoDB database name'),
    UPLOAD_DIRECTORY: Joi.string().description('Upload file directory'),
    QUEUE_NAME: Joi.string().description('Queue name'),
    INVITATION_EXPIRATION_MINUTES: Joi.number()
      .default(10800)
      .description('minutes after which invitation expires'),
    ZOHO_DESK_CLIENT_ID: Joi.string().description('Zoho desk client id'),
    ZOHO_DESK_CLIENT_SECRET: Joi.string().description('Zoho desk client secret'),
    ZOHO_DESK_DEPARTMENT_ID: Joi.string().description('Zoho desk department id'),
    ZOHO_DESK_GRANT_CODE: Joi.string().description('Zoho desk grant code'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  serverUrl: envVars.SERVER_URL,
  mongoose: {
     url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    databaseName: envVars.DATABASE_NAME,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  defaultPassword: envVars.DEFAULT_PASSWORD,
  facebook: {
    clientID: envVars.FACEBOOK_API_KEY,
    clientSecret: envVars.FACEBOOK_API_SECRET,
    callbackURL: envVars.FACEBOOK_CALLBACK_URL
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
      // secure: false,
      // tls: {
      //   rejectUnauthorized: true,
      //   minVersion: "TLSv1.2",
      //   servername: "drobverse.com"
      // },
    },
    from: envVars.EMAIL_FROM,
  },
  easyShipApiKey: envVars.EASY_SHIP_API_KEY,
  clientUrl: envVars.CLIENT_URL,
  paypalClientId: envVars.PAYPAL_CLIENT_ID,
  paypalSecret: envVars.PAYPAL_SECRET,
  spotify: {
    spotifyClientId: envVars.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: envVars.SPOTIFY_CLIENT_SECRET,
    spotifyRedirect: envVars.SPOTIFY_REDIRECT
  },
  shouldCompressGlb: envVars.SHOULD_COMPRESS_GLB,
  shouldCompressImage: envVars.SHOULD_COMPRESS_IMAGE,
  uploadDirectory: envVars.UPLOAD_DIRECTORY,
  queueName: envVars.QUEUE_NAME,
  invitationExpirationMinutes: envVars.INVITATION_EXPIRATION_MINUTES,
  zohoDeskClientId: envVars.ZOHO_DESK_CLIENT_ID,
  zohoDeskClientSecret: envVars.ZOHO_DESK_CLIENT_SECRET,
  zohoDeskDepartmentId: envVars.ZOHO_DESK_DEPARTMENT_ID,
  zohoDeskGrantCode: envVars.ZOHO_DESK_GRANT_CODE
};
