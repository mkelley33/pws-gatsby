import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../../config/env';
import nodeMailer from 'nodemailer';
import User from '../models/user.model';
import Token from '../models/token.model';

function sendUnauthorized(res) {
  res.status(401).json({ errors: { invalidCredentials: 'The e-mail or password provided was incorrect.' } });
}

function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, config.jwtSecret, err => {
      if (err) {
        res.status(403).json({ errors: { token: 'Unauthorized: token expired' } });
      } else {
        res.status(200).send();
      }
    });
  }
}

function signin(req, res, next) {
  const { email, password } = req.body;
  User.getByEmail(email)
    .then(user => {
      if (user && user.isVerified) {
        user.comparePassword(password, (err, isMatch) => {
          if (isMatch) {
            const token = jwt.sign(
              {
                roles: user.roles,
                email: user.email,
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
              },
              config.jwtSecret,
              {
                subject: user.id,
                expiresIn: '12h',
              }
            );
            res.cookie('token', token, { httpOnly: true });
            res.json({ userId: user.id, roles: user.roles });
          } else {
            sendUnauthorized(res);
          }
        });
      } else {
        sendUnauthorized(res);
      }
    })
    .catch(e => next(e));
}

function signout(req, res) {
  res.clearCookie('token');
  res.json({ success: true });
}

function sendResetPasswordEmail(user, token) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  const resetPasswordUrl = `${config.protocol}://${config.host}${config.clientPort}/reset-password/${token.token}`;
  const mailOptions = {
    from: config.mail.sender, // sender address
    to: user.email, // list of receivers
    subject: 'Please reset your forgotten password', // Subject line
    // TODO: Make a plain text version that has a link that can be copied
    text: '', // plain text body
    html: `<table style="border: 0">
             <tr>
               <td style="padding-top: 30px;">Please <a href="${resetPasswordUrl}">reset your password</a> in order to gain access to the site.</td>
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

function forgotPassword(req, res, next) {
  const { email } = req.body;
  User.getByEmail(email)
    .then(user => {
      const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString('hex'),
      });
      token.save();
      sendResetPasswordEmail(user, token);
      res.json({ success: 'E-mail sent successfully.' });
    })
    .catch(e => next(e));
}

function resetPassword(req, res, next) {
  const { password, token } = req.body;
  Token.findOne({ token }).then(token => {
    User.findOne({ _id: token.userId }).then(user => {
      user.password = password;
      user.save().then((data, err) => {
        if (err) {
          next(err);
        } else {
          res.json({ success: 'The password was reset succesfully' });
        }
      });
    });
  });
}

export default { signin, signout, forgotPassword, resetPassword, isAuthenticated };
