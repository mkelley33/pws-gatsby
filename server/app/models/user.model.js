import httpStatus from 'http-status';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';
import { messages, patterns } from '../validation';

const Schema = mongoose.Schema;

const ROLE_ADMIN = 'admin';
const ROLE_FAMILY = 'family';
const ROLE_FRIEND = 'friend';
const ROLE_USER = 'user';

function normalizePhone(value) {
  if (value) {
    return value.replace(/[\D]*/);
  }
  return value;
}

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: messages.blank,
    maxlength: [50, messages.maxlength(50)],
  },
  lastName: {
    type: String,
    trim: true,
    required: messages.blank,
    maxlength: [50, messages.maxlength(50)],
  },
  email: {
    type: String,
    index: true,
    trim: true,
    lowercase: true,
    match: [patterns.email, messages.email],
    required: messages.blank,
    unique: true,
  },
  password: {
    type: String,
    required: messages.blank,
    // bcrypt limits max password length to 72 characters.
    maxlength: [72, messages.maxlength(72)],
    // TODO: Verify and ensure that no more than 2 identical characters in a row are used in a password.
    // https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Password_Complexity
    match: [patterns.password, messages.password],
    select: false,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    set: normalizePhone,
    match: [patterns.phone, messages.phone],
    index: true,
  },
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  roles: {
    type: [
      {
        type: String,
        enum: [ROLE_ADMIN, ROLE_FAMILY, ROLE_FRIEND, ROLE_USER],
      },
    ],
    default: [ROLE_USER],
  },
});

UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(user => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * Gets a user by e-mail. Includes password.
   * @param {string} email - the email.
   * @returns {Promise<User>}
   */
  getByEmail(email) {
    return this.findOne({ email })
      .select('+password')
      .exec();
  },
};

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
export { ROLE_ADMIN, ROLE_FRIEND, ROLE_FAMILY, ROLE_USER };
