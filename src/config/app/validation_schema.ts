import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_ENV: Joi.string().valid('development', 'staging', 'production'),
  APP_NAME: Joi.string().default('Startup'),
  APP_PORT: Joi.number().default(8000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().required(),
});