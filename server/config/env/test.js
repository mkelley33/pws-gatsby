export default {
  env: 'test',
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: 'mongodb://localhost/api-test',
    options: {
      useMongoClient: true,
      keepAlive: true,
      socketTimeoutMS: 0,
      reconnectTries: 30,
      user: process.env.LHS_USER,
      pass: process.env.LHS_PASS,
    },
  },
  port: 4040
};
