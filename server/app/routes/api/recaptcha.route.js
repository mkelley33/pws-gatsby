import express from 'express';
import recaptchaCtrl from '../../controllers/recaptcha.controller';

const router = express.Router();

router.route('/').post(recaptchaCtrl.verify);

export default router;
