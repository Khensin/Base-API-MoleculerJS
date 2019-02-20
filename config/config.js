require('dotenv').config({ silent: process.env === 'production' });

const devConfig = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME_DEV || '',
  username: process.env.DB_USER_DEV || 'postgres',
  password: process.env.DB_PASSWORD_DEV || '',
  migrationStorageTableName: 'migrations'
};
const prodConfig = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME_PROD || '',
  username: process.env.DB_USER_PROD || 'postgres',
  password: process.env.DB_PASSWORD_PROD || '',
  migrationStorageTableName: 'migrations'
};
module.exports = {
  development: devConfig,
  production: prodConfig
};

