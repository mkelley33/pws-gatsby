import nodeMailer from 'nodemailer';
import config from '../../config/env';

function sendContactEmail(firstName, lastName, email, message, next) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass,
    },
  });

  const mailOptions = {
    from: config.mail.sender,
    to: config.mail.user,
    subject: 'New contact message', // Subject line
    text: `From: ${firstName} ${lastName}\n
${email}\n
${message}\n
    `,
  };

  transporter.sendMail(mailOptions, error => {
    if (error) {
      return next(error);
    }
  });
}

function contact(req, res, next) {
  const { firstName, lastName, email, message } = req.body;
  sendContactEmail(firstName, lastName, email, message, next);
  res.status(200).json({ success: true });
}

export default { contact };
