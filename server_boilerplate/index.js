require('dotenv').config();

const config = require('./config')();
const apiDocs = require('./api-docs')({ config });

const package = {
  bcrypt: require('bcrypt'),
  crypto: require('crypto'),
  path: require('path'),
  express: require('express'),
  bodyParser: require('body-parser'),
  cors: require('cors'),
  httpError: require('http-errors'),
  Sequelize: require('sequelize'),
  moment: require('moment'),
  swaggerUi: require('swagger-ui-express'),
  multer: require('multer'),
  multerS3: require('multer-s3'),
  AWS: require('aws-sdk'),
  Web3: require('web3'),
  BigNumber: require('bignumber.js'),
  asyncHandler: require('express-async-handler'),
  axios: require('axios'),
  schedule: require('node-schedule'),
  uuid: require('uuid'),
  sanitizeFilename: require('sanitize-filename'),

  passport: require('passport'),
  jwt: require('jsonwebtoken'),
  passportJwt: require('passport-jwt')
};

// Fix for TIMESTAMP WITHOUT TIME ZONE
require('pg').types.setTypeParser(1114, str => new Date(str + "+0000"));

const { path, express, bodyParser, cors, swaggerUi } = package;

const models = require(`${config.path.server}models`)({ config, package });
const helpers = require(`${config.path.server}helpers`)({ config, package });
const middlewares = require(`${config.path.server}middlewares`)({ config, package });
const services = require(`${config.path.server}services`)({ config, package, models });
const controllers = require(`${config.path.server}controllers`)({ config, package, models, helpers });
const routes = require(`${config.path.server}routes`)({ controllers, package, middlewares });
const app = express();

const port = process.env.PORT || config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Initialize passport jwt auth
app.use(services.auth.initialize());

// Enable CORS for all routes
app.use(cors());
app.options('*', cors());

app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use(`/api/${config.apiVersion}`, routes);
app.use(`/uploads`, express.static('uploads'));
// Set routes for client
app.use('/', express.static(config.path.client));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(config.path.client, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  let errors = [];
  let code = [];

  const defaultStatus = 500;
  const defaultMessage = 'Unknown error';

  const status = err.status || defaultStatus;
  const errorMessageObject = typeof err.message == 'object' ? err.message : null;
  const message = (errorMessageObject ? errorMessageObject.message : err.message) || defaultMessage;

  if (errorMessageObject) {
    errors.push(errorMessageObject);
  }

  if (['SequelizeUniqueConstraintError', 'SequelizeValidationError'].indexOf(err.name) > -1 ) {
    if (err.errors) {
      err.errors.forEach(errorItem => {
        errors.push({ field: errorItem.path, message: errorItem.message });
      });
    }
  }

  if (errors.length) {
    code = [ ...new Set(errors.map(errorItem => errorItem.field)) ];
  }

  // Print stack trace
  console.error(err.stack);

  res.status(status).json({ message, code, errors });
});

// Set port
app.listen(port);

console.log(`Server running on port ${port}`);

return app;