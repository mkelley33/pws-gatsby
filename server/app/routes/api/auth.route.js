import express from 'express';
import authCtrl from '../../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

/**
 * @swagger
 * /api/auth/sign-in:
 *  post:
 *    tags:
 *      - Auth
 *    description: Authenticates a user.
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: A cookie containing a JWT.
 */
router.route('/sign-in').post(authCtrl.signin);

/**
 * @swagger
 * /api/v1/auth/is-authenticated:
 *  post:
 *    tags:
 *      - Auth
 *    description: Checks to see if use is authenticated.
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: A success or failure message.
 */
router.route('/is-authenticated').get(authCtrl.isAuthenticated);

/**
 * @swagger
 * /api/auth/forgot-password:
 *  post:
 *    tags:
 *      - Auth
 *    description: Sends a reset password link in an e-mail to the user.
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: A successful response.
 */
router.route('/forgot-password').post(authCtrl.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *  post:
 *    tags:
 *      - Auth
 *    description: Resets a user's password given a token.
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: A successful response.
 */
router.route('/reset-password').post(authCtrl.resetPassword);

/**
 * @swagger
 * /api/auth/signout:
 *  post:
 *    tags:
 *      - Auth
 *    description: Removes authentication cookie
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: A successful response.
 */
router.route('/signout').post(authCtrl.signout);

export default router;
