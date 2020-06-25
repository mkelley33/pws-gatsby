export default {
  host: process.env.HOST,
  env: 'production',
  protocol: 'https',
  mail: {
    user: 'michauxkelley@gmail.com',
    pass: process.env.EMAIL_PASS,
    sender: 'Michaux Kelley <michauxkelley@gmail.com>',
  },
  MONGOOSE_DEBUG: true,
  jwtSecret: process.env.JWT_SECRET,
  db: {
    uri: `mongodb+srv://pws-user:${process.env.PWS_PASS}@cluster0-plswm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      keepAlive: true,
      socketTimeoutMS: 0,
      useUnifiedTopology: true,
      useCreateIndex: true,
      user: process.env.PWS_USER,
      pass: process.env.PWS_PASS,
    },
  },
  port: 443,
};
