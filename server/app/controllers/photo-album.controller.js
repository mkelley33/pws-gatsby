import PhotoAlbum from '../models/photo-album.model';
import Photo from '../models/photo.model';
import mongoose from 'mongoose';

function get(req, res, next) {
  const { id } = req.params;
  const { skip, limit } = req.query;

  Promise.all([
    PhotoAlbum.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: '$photos' },
      { $skip: parseFloat(skip) },
      { $limit: parseFloat(limit) },
    ]),
    PhotoAlbum.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: '$photos' },
      { $count: 'photos' },
    ]),
  ])
    .then(data => {
      res.json({ photos: data[0], totalCount: data[1][0].photos });
    })
    .catch(err => {
      next(err);
      res.json({ error: 'Something went wrong' });
    });
}

function create(req, res, next) {
  const { name, userId, isPublic } = req.body;
  new PhotoAlbum({ name, userId, isPublic }).save().then(response => {
    res.json(response);
  });
}

function list(req, res, next) {
  const { userId } = res.locals.authorizedData;
  const { isPublic } = req.query;
  if (typeof isPublic === 'undefined') {
    PhotoAlbum.find({ userId })
      .then(albums => {
        res.json(albums);
      })
      .catch(e => next(e));
  } else {
    PhotoAlbum.find({ userId, isPublic })
      .then(albums => {
        res.json(albums);
      })
      .catch(e => next(e));
  }
}

function deleteAlbum(req, res, next) {
  const { id } = req.params;
  PhotoAlbum.findByIdAndDelete(id, (error, doc) => {
    if (error) next(error);
    Photo.remove({ _id: { $in: doc.photos } }, (error, doc) => {
      if (error) next(error);
      res.json({ success: true });
    });
  });
}

export default { create, list, deleteAlbum, get };
