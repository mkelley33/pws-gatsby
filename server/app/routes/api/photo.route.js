import express from 'express';
import photoCtrl from '../../controllers/photo.controller';
import withAuthentication from '../../middlewares/with-authentication';

const router = express.Router();

router.route('/').get(withAuthentication, photoCtrl.list);

router.route('/upload').post(withAuthentication, photoCtrl.upload);

router.route('/:id').delete(withAuthentication, photoCtrl.deletePhoto);

export default router;
