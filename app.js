require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { createServer } = require('node:http');
const { Server } = require('socket.io');

const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const defaultError = require('./middlewares/defaultError');
const { port, dbUrl } = require('./utils/jwtConfig');
const limiter = require('./middlewares/rateLimiter');
const cors = require('./middlewares/cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
global.io = io;

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(requestLogger);
app.use(limiter);
app.use(cookieParser());
app.use(cors);
app.use('/api', express.static(`${__dirname}/uploads`));
app.use('/api', express.json(), routes);
app.use(errorLogger);
app.use(errors());
app.use(defaultError);

io.on('connection', (socket) => {
  socket.on('chat', (value) => {
    socket.join(value);
  });
});

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  try {
    await server.listen(port);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
}

main();
