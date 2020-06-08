export default {
  env: 'development',
  protocol: 'http',
  host: 'localhost',
  clientPort: ':8000',
  mail: {
    user: 'michauxkelley@gmail.com',
    pass: process.env.EMAIL_PASS,
    sender: 'Michaux Kelley <michauxkelley@gmail.com>',
  },
  MONGOOSE_DEBUG: true,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: 'mongodb://localhost/api-development',
    options: {
      useNewUrlParser: true,
      keepAlive: true,
      socketTimeoutMS: 0,
      reconnectTries: 30,
      user: process.env.PWS_USER,
      pass: process.env.PWS_PASS,
    },
  },
  port: 8080,
};
