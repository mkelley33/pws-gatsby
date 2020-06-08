import express from 'express';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import winstonInstance from './winston';
import swaggerJSDoc from 'swagger-jsdoc';
import apiRouter from '../app/routes/api/index.route';
import config from './env';
import expressFileUpload from 'express-fileupload';
import APIError from '../app/helpers/APIError';

const app = express();

const { title, version, description } = config.api;
const swaggerDefinition = {
  info: { title, version, description },
  host: `${config.host}:${config.port}`,
};

const options = {
  swaggerDefinition,
  apis: ['./app/routes/api/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
      bodyBlacklist: ['password', 'oldPassword', 'newPassword', 'confirmPassword'],
    })
  );
}

const corsOptions = {
  origin(origin, callback) {
    callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,token');
  next();
};
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(
  expressFileUpload({
    limits: { fileSize: config.fileSizeLimit },
    safeFileNames: true,
    preserveExtension: 4,
    abortOnLimit: true,
  })
);

// In production serve static files using NGINX, but in development let express serve them.
if (config.env === 'development') {
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

// Mount api routes on /api/v1 path.
app.use('/api/v1', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    })
  );
}

// error handler, send stacktrace only during development
// app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
//   res.status(err.status).json({
//     message: err.isPublic ? err.message : httpStatus[err.status],
//     stack: config.env === 'development' ? err.stack : {}
//   })
// );

export default app;
