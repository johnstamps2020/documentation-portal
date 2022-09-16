const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DOCPORTAL_DB_HOST,
  port: 5432,
  username: 'postgres',
  password: process.env.DOCPORTAL_DB_PASSWORD,
  database: 'postgres',
  entities: [
    require('./entity/page'),
    require('./entity/item'),
    require('./entity/selector'),
  ],
  synchronize: process.env.NODE_ENV === 'development',
});

module.exports = AppDataSource;
