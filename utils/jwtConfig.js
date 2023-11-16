const {
  NODE_ENV,
  JWT_SECRET,
  PORT,
  DB_URL,
} = process.env;

const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
const port = NODE_ENV === 'production' ? PORT : 3001;
const dbUrl = NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb';

module.exports = {
  secretKey,
  port,
  dbUrl,
};
