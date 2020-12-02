module.exports = {
  prod: {
    client: 'mysql',
    connection: {
      host: process.env.DBSERVER,
      database: process.env.MYSQL_DATABASE,
      user:     'root',
      password: process.env.DBPASS
    }
  },
  dev: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: process.env.MYSQL_DATABASE,
      user:     'root',
      password: process.env.MYSQL_ROOT_PASSWORD
    }
  }
};