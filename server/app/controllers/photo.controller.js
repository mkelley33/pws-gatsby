import fs from 'fs-extra';
import sharp from 'sharp';

import Photo from '../models/photo.model';
import PhotoAlbum from '../models/photo-album.model';

function makeThumbs(dirPath, filePath, fileName) {
  const thumbsDir = `${dirPath}/thumbs`;
  fs.ensureDir(thumbsDir).then(() => {
    const thumbFilePath = `${thumbsDir}/${fileName}`;
    sharp(filePath)
      .resize(400)
      .toFile(thumbFilePath);
  });
}

function upload(req, res, next) {
  const imageFile = req.files.file;
  const fileName = imageFile.name;
  if (['image/jpeg', 'image/png'].includes(imageFile.mimetype)) {
    const { userId, albumId } = req.body;
    const dirPath = `${__dirname}/../../public/images/${userId}/`;
    const filePath = `${dirPath}${fileName}`;
    fs.ensureDir(dirPath).then(() => {
      imageFile.mv(filePath, function(err) {
        if (err) {
          return res.status(500).send(err);
        }
        makeThumbs(dirPath, filePath, fileName);
        const photo = new Photo({
          filename: fileName,
          userId: req.body.userId,
        });
        photo.save();
        if (albumId !== 'undefined') {
          PhotoAlbum.findOneAndUpdate({ _id: req.body.albumId }, { $push: { photos: photo } }, (error, doc, res) => {
            if (error) {
              return next(error);
            }
          });
        }
        return res.status(200).json({ file: `public/images/${userId}/${fileName}` });
      });
    });
  } else {
    res.status(415).json({ errors: { file: 'The image must be a jpeg or png.' } });
  }
}

function list(req, res, next) {
  // By default get only photos by user
  // If params are for shared, get shared photos
  const { skip, limit } = req.query;
  Photo.findPaginated(
    { userId: res.locals.authorizedData.userId },
    { skip: parseFloat(skip), limit: parseFloat(limit), sort: '-createdAt' },
    (err, results) => {
      if (err) return next(err);
      res.json({ photos: results.results, totalCount: results.totalCount });
    }
  );
}

function deletePhoto(req, res, next) {
  Photo.findByIdAndDelete(req.params.id).then((photo, err) => {
    if (err) {
      next(err);
    }
    fs.unlink(`${__dirname}/../../public/images/${res.locals.authorizedData.userId}/${photo.filename}`, err => {
      if (err) {
        next(err);
      }
      fs.unlink(
        `${__dirname}/../../public/images/${res.locals.authorizedData.userId}/thumbs/${photo.filename}`,
        err => {
          if (err) {
            next(err);
          }
          PhotoAlbum.updateMany({}, { $pull: { photos: { _id: photo._id } } }).then(data => {
            return res.json({ success: true });
          });
        }
      );
    });
  });
}

export default { upload, list, deletePhoto };
