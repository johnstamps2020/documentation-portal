const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db.vomrskpplplhkpzfnzvw.supabase.co',
  port: 5432,
  username: 'postgres',
  password: process.env.SUPABASE_DATABASE_PASSWORD,
  database: 'postgres',
  entities: ['./entity/**/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
});

module.exports = AppDataSource;
