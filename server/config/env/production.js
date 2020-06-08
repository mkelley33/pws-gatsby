export default {
  host: 'localhost',
  env: 'production',
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: 'mongodb://localhost/api-production',
    options: {
      useMongoClient: true,
      keepAlive: true,
      socketTimeoutMS: 0,
      reconnectTries: 30,
      user: process.env.LHS_USER,
      pass: process.env.LHS_PASS,
    },
  },
  port: 4040,
};
