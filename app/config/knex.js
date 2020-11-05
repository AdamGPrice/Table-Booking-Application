require('dotenv').config();

module.exports = {
  prod: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: process.env.MYSQL_DATABASE,
      user:     'root',
      password: process.env.MYSQL_ROOT_PASSWORD
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },
  dev: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: process.env.MYSQL_DATABASE,
      user:     'root',
      password: process.env.MYSQL_ROOT_PASSWORD
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },
};