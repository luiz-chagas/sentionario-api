require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
const logger = require('./src/util/logger');

const index = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

app.use(helmet());

const authMiddleware = require('./middleware/auth');

app.use(morgan('dev'));
app.use(session({
  secret: 'PP#BBKB@H',
  name: 'ttl',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 604800000, // 1 week
  },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Start passport
app.use(authMiddleware.initialize());
app.use(authMiddleware.session());

app.use('/', index);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Endereço inválido');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  logger.info(new Error(err.message));
  res.status(err.status || 400).json({ error: err.message });
});

module.exports = app;
