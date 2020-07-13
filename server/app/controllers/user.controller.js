import User, { ROLE_ADMIN } from '../models/user.model';
import Token from '../models/token.model';
import nodeMailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../../config/env';

function sendVerificationEmail(user) {
  // TODO: add a timestamp to the token so that there is a way to retrieve the latest one created for the user
  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString('hex'),
  });
  token.save();
  if (process.env.NODE_ENV === 'test') {
    // TODO: possibly write token to a file from which it
    // can later be read in tests
  }

  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });
  const verificationUrl = `${config.protocol}://${config.host}${config.clientPort}/email-verification/${token.token}`;
  const mailOptions = {
    from: config.mail.sender, // sender address
    to: user.email, // list of receivers
    subject: 'Please verify your e-mail to activate your account', // Subject line
    // TODO: Make a plain text version that has a link that can be copied
    text: '', // plain text body
    html: `<table style="border: 0">
                <tr>
                  <td style="background-color: #068ab3; color: #ffffff; height: 75px; padding-left: 30px; padding-right: 30px;"><h1>*Verify your e-mail address, please.</h1></td>
                </tr>
                <tr>
                  <td style="padding-top: 30px;">Please <a href="${verificationUrl}">verify your email address</a> in order to gain access to the site.</td>
                </tr>
               </table>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

function search(req, res, next) {
  // TODO: implement user search to find by e-mail, last name, first name, or role (ie. find all admins)
  // TODO: only allow admin to perform user search.
}

function verification(req, res, next) {
  Token.findOne({ token: req.params.token })
    .then(token => {
      // If a token exists then a user will exist that matches it, so no need to
      // check for a not found error
      User.findOne({ _id: token.userId }).then(user => {
        if (user.isVerified) {
          return res.status(400).json({ message: 'already verified' });
        }
        user.isVerified = true;
        user.verifiedAt = Date.now();
        user.save().then(() => {
          res.status(200).json({ message: 'verified' });
        });
      });
    })
    .catch(err => {
      return res.status(400).json({
        message: 'expired token',
      });
    });
}

function resendVerificationEmail(req, res, next) {
  // TODO: implement way to prevent user from being verified if banned
  User.findOne({ email: req.body.email })
    .then(user => {
      sendVerificationEmail(user);
      res.json({ message: 'verification email resent' });
    })
    .catch(err => {
      res.status(400).json({
        message: 'user not found',
      });
    });
}

function load(req, res, next, id) {
  User.get(id)
    .then(user => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  // TODO: send 404 if no user.
  return res.json(req.user);
}

function getProfile(req, res, next) {
  const token = req.cookies.token;
  jwt.verify(token, config.jwtSecret, async (err, decoded) => {
    if (err) {
      next(err);
    }
    const { userId } = decoded;
    const user = await User.findById(userId).exec();
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userId: user._id,
      roles: user.roles,
    });
  });
}

function create(req, res, next) {
  const { firstName, lastName, username, email, password, phone } = req.body;
  new User({ firstName, lastName, username, email, password, phone })
    .save()
    .then(savedUser => {
      sendVerificationEmail(savedUser);
      res.json(savedUser);
    })
    .catch(e => next(e));
}

function updateUser(user, errors, req, res, next) {
  Object.assign(req.user, user)
    .save()
    .then(savedUser => res.json({ savedUser, errors }))
    .catch(e => next(e));
}

function update(req, res, next) {
  const { firstName, lastName, email, roles, currentPassword, password } = req.body;
  const errors = [];
  // TODO: what if user isn't verified?
  if (req.user.isVerified) {
    User.findById(req.params.userId).then(user => {
      if (currentPassword) {
        user.comparePassword(currentPassword, (err, isMatch) => {
          if (isMatch) {
            user.password = password;
          } else {
            errors.push({ error: 'invalid credentials' });
          }
        });
      }
      if (user.roles.includes(ROLE_ADMIN)) {
        updateUser(Object.assign(user, { firstName, lastName, email, roles }), errors, req, res, next);
      } else {
        updateUser(Object.assign(user, { firstName, lastName, email }), errors, req, res, next);
      }
    });
  }
}

function list(req, res, next) {
  // TODO: Allow limit to be set up to a reasonable maximum.
  // TODO: Only allow admin to list users.
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => {
      res.json(users);
    })
    .catch(e => next(e));
}

function remove(req, res, next) {
  // TODO: Only allow admin to remove users or allow user to remove self (delete account).
  const user = req.user;
  user
    .remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove, verification, resendVerificationEmail, getProfile };
