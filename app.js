require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const router = require('./routes/index');
const {
  PORT,
  DB_URL,
  corsMethods,
  corsHeaders,
  errorMessages,
} = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const limiter = require('./middlewares/limiter');

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: '*',
  methods: corsMethods,
  allowedHeaders: corsHeaders,
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.options('*', cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(errorMessages.serverCrashError);
  }, 0);
});

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT);
