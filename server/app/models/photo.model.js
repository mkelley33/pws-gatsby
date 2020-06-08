import mongoose from 'mongoose';
import async from 'async';

const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
  {
    filename: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    isPublic: { type: mongoose.Schema.Types.Boolean, default: false },
  },
  { timestamps: true }
);

function findPaginated(filter, options, cb) {
  var defaults = { skip: 0, limit: 10 };
  options = Object.assign({}, defaults, options);

  filter = Object.assign({}, filter);

  var countQuery = this.find(filter);
  var findQuery = this.find(filter);

  if (options.sort) {
    findQuery = findQuery.sort(options.sort);
  }

  if (options.fields) {
    findQuery = findQuery.select(options.fields);
  }

  findQuery = findQuery.limit(options.limit).skip(options.skip);

  async.parallel([cb => countQuery.count(cb), cb => findQuery.exec(cb)], function(err, results) {
    if (err) return cb(err);
    let count = 0;
    let ret = [];

    results.forEach(result => {
      if (typeof result == 'number') {
        count = result;
      } else if (typeof result != 'number') {
        ret = result;
      }
    });

    cb(null, { totalCount: count, results: ret });
  });

  return findQuery;
}

PhotoSchema.statics.findPaginated = findPaginated;

/**
 * @typedef Photo
 */
export default mongoose.model('Photo', PhotoSchema);
export { PhotoSchema };
