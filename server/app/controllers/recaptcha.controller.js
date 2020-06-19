import request from 'request';

function verify(req, res) {
  const { token } = req.body;

  if (token === undefined || token === '' || token === null) {
    return res.json({ error: 'unverified' });
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${req.connection.remoteAddress}`;

  request(verificationUrl, function (error, response, body) {
    const resBody = JSON.parse(body);
    if (resBody.success !== undefined && !resBody.success) {
      return res.json({ error: 'unverified' });
    }
    res.json({ success: true });
  });
}

export default { verify };
