import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import photoRoutes from './photo.route';
import photoAlbumRoutes from './photo-albums.route';
import recaptchaRoutes from './recaptcha.route';
import contactRoutes from './contact.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/photos', photoRoutes);
router.use('/photo-albums', photoAlbumRoutes);
router.use('/recaptcha', recaptchaRoutes);
router.use('/contact', contactRoutes);

// Source: https://github.com/gothinkster/node-express-realworld-example-app/blob/master/routes/api/index.js
router.use(function (err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;
        return errors;
      }, {}),
    });
  } else if (err.name === 'MongoError') {
    if (err.code === 11000 && err.errmsg.includes('email_1')) {
      res.status(422).json({ errors: { email: 'That e-mail is already being used.' } });
    }
  } else {
    console.log(res);
    res.status(422).json({ errors: { email: 'Something went wrong.' } });
  }
  return next(err);
});

export default router;
