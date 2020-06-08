import express from 'express';
import userCtrl from '../../controllers/user.controller';
import disableCache from '../../middlewares/disable-cache';
import withAuthentication, { withAuthenticationAndRole } from '../../middlewares/with-authentication';
import { ROLE_ADMIN } from '../../models/user.model';

const router = express.Router(); // eslint-disable-line new-cap

/**
 * @swagger
 * definitions:
 *  User:
 *    required:
 *      - firstName
 *      - lastName
 *      - email
 *    properties:
 *      firstName:
 *        type: string
 *      lastName:
 *        type: string
 *      email:
 *        type: strings
 */

/**
 * @swagger
 * /api/users:
 *  get:
 *    tags:
 *      - Users
 *    description: Returns all users
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: An array of users
 *        schema:
 *          $ref: '#/definitions/User'
 */
router.route('/').get(disableCache, withAuthenticationAndRole(ROLE_ADMIN), userCtrl.list);

/**
 * @swagger
 * /api/users:
 *  post:
 *    tags:
 *      - Users
 *    description: Creates a new user.
 *    produces:
 *      - application/json
 *    parameters:
 *     - name: user
 *       description: User object
 *       in: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/User'
 *    responses:
 *      200:
 *        description: Successfully created
 */
router.route('/').post(userCtrl.create);

/**
 * @swagger
 * /api/v1/users/profile:
 *  get:
 *    tags:
 *      - Users
 *    description: Get the user stored in the JWT cookie
 *    produces:
 *      - application/json
 *    responses:
 *      "200":
 *        description: successful operation
 *        schema:
 *          $ref: "#/definitions/User"
 */
router.route('/profile').get(withAuthentication, userCtrl.getProfile);

/**
 * @swagger
 * /api/users/{userId}:
 *  get:
 *    tags:
 *      - Users
 *    description: Get a user by ID
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: userId
 *        description: ID of User to get
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      "200":
 *        description: successful operation
 *        schema:
 *          $ref: "#/definitions/User"
 *      "404":
 *        description: User not found
 *      "400":
 *        description: Invalid ID supplied
 */
router.route('/:userId').get(withAuthentication, userCtrl.get);

/**
 * @swagger
 * /api/users/{userId}:
 *  put:
 *    tags:
 *      - Users
 *    description: Update a user
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: ID of the User to update
 *        required: true
 *        type: string
 *      - in: body
 *        name: user
 *        description: User object
 *        required: false
 *        schema:
 *          $ref: '#/definitions/User'
 *    responses:
 *      "404":
 *        description: User not found
 *      "400":
 *        description: Invalid ID supplied
 */
router.route('/:userId').put(withAuthentication, userCtrl.update);

/**
 * @swagger
 * /api/users/{userId}:
 *  delete:
 *    tags:
 *      - Users
 *    description: Delete a user
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: ID of the User to delete
 *        required: true
 *        type: string
 *    responses:
 *      "404":
 *        description: User not found
 *      "400":
 *        description: Invalid ID supplied
 */
router.delete(withAuthentication, userCtrl.remove);

/**
 * @swagger
 * /api/users/verification/resend:
 *  get:
 *    tags:
 *      - Users
 *    description: Resend verification e-mail
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: email
 *        description: e-mail to which verification should be resent
 *        required: true
 *        type: string
 *    responses:
 *      "400":
 *        description: User not found
 */
router.route('/verification/resend').post(userCtrl.resendVerificationEmail);

/**
 * @swagger
 * /api/users/verification/{token}:
 *  get:
 *    tags:
 *      - Users
 *    description: Verify (activate) an account via e-mail
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: token
 *        description: Token used to verify e-mail
 *        required: true
 *        type: string
 *    responses:
 *      "400":
 *        description: Token expired
 *      "403":
 *        description: Already verified
 */
router.route('/verification/:token').get(userCtrl.verification);

router.param('userId', userCtrl.load);

export default router;
