const config = {};
config.db = {};

//The host 

//config.webhost = 'http://localhost:3000/';
config.webhost = process.env.WEB_HOST;

// your MongoDB host and database name

//config.db.connectionString = 'mongodb://localhost/url_shortener';
config.db.connectionString = process.env.MONGO_DB_CONNECT_STRING;

module.exports = config;