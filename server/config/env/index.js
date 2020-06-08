import path from 'path';

const env = process.env.NODE_ENV || 'development';
const config = require(`./${env}`); // eslint-disable-line import/no-dynamic-require

const defaults = {
  root: path.join(__dirname, '/..'),
  api: {
    title: 'API: Users and Application Resources',
    version: '0.0.1',
    description: 'A RESTful API for managing users and application resources.'
  },
  fileSizeLimit: 10 * 1024 * 1024
};

export default Object.assign(defaults, config);
