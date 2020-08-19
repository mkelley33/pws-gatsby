import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'gatsby';
import classnames from 'classnames';
import Pagination from 'react-js-pagination';
import { toast } from 'react-toastify';

import styles from './photo-gallery.module.css';
import api from '../api';
import Layout from '@components/layout';
import ModalConfirm from '@components/Modal/ModalConfirm';
import withAuthentication from '@components/withAuthentication';

const AddAlbumLink = props => {
  return (
    <div className={styles.addAlbumLink}>
      <Link to="/photo-albums">+</Link>
    </div>
  );
};

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [pageRange, setPageRange] = useState(1);
  const [offset, setOffset] = useState(0);
  const [isAlbumClick, setIsAlbumClick] = useState(false);
  const [albumId, setAlbumId] = useState(null);
  const [albumName, setAlbumName] = useState(null);
  const [showViewAllPhotos, setShowViewAllPhotos] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const perPage = useRef(9);

  const getPhotos = useCallback(
    id => {
      if (isAlbumClick) {
        return api.get(`/photo-albums/${id}`, { params: { limit: perPage.current, skip: offset } });
      } else {
        return api.get('/photos', { params: { limit: perPage.current, skip: offset } });
      }
    },
    [isAlbumClick, offset]
  );

  const handlePrivateAlbumsClick = () => {
    api.get('/photo-albums/', { params: { isPublic: false } }).then(response => {
      setAlbums(response.data);
    });
  };

  const handleSharedAlbumsClick = () => {
    api.get('/photo-albums/', { params: { isPublic: true } }).then(response => {
      setAlbums(response.data);
    });
  };

  const handleAllAlbumsClick = () => {
    api.get('/photo-albums/').then(response => {
      setAlbums(response.data);
    });
  };

  useEffect(() => {
    Promise.all([getPhotos(), api.get('/photo-albums')])
      .then(res => {
        const pageCount = Math.ceil(res[0].data.totalCount / perPage);
        setPhotos(res[0].data.photos);
        setTotalCount(res[0].data.totalCount);
        setPageRange(pageCount <= perPage.current ? pageCount : perPage.current);
        setAlbums(res[1].data);
      })
      .catch(err => {
        toast.error('Something went wrong', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
        });
      });
  }, [getPhotos]);

  const deletePhoto = id => {
    const photosFiltered = photos.filter(photo => photo._id !== id);
    setPhotos(photosFiltered);
    api.delete(`/photos/${id}`).then(res => {
      toast.success('You successfully deleted the photo', {
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
      });
    });
  };

  const deleteAlbum = id => {
    const albumsFiltered = albums.filter(album => {
      return album._id !== id;
    });
    setAlbums(albumsFiltered);
    api.delete(`/photo-albums/${id}`).then(res => {
      handleViewAllPhotosClick();
      toast.success('You successfully deleted the album', {
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
      });
    });
  };

  const handleAlbumClick = event => {
    const { id } = event.target.dataset;
    setOffset(0);
    setActivePage(1);
    setIsAlbumClick(true);
    setAlbumId(id);
    setShowViewAllPhotos(true);
    getPhotos(id).then(res => {
      const pageCount = Math.ceil(res.data.totalCount / perPage);
      setPhotos(res.data.photos.map(photo => photo.photos));
      setTotalCount(res.data.totalCount);
      setPageRange(pageCount <= perPage.current ? pageCount : perPage.current);
      setAlbumName(res.data.photos[0].name);
    });
  };

  const handlePageChange = pageNumber => {
    const offset = (pageNumber - 1) * perPage.current;
    setOffset(offset);
    setActivePage(pageNumber);
    getPhotos(albumId).then(res => {
      if (res.data && res.data.photos && res.data.photos[0] && res.data.photos[0].photos) {
        setPhotos(res.data.photos.map(photo => photo.photos));
        setTotalCount(res.data.totalCount);
      } else {
        setPhotos(res.data.photos);
        setTotalCount(res.data.totalCount);
      }
    });
  };

  const handleViewAllPhotosClick = () => {
    setAlbumId(undefined);
    setIsAlbumClick(false);
    setAlbumName(undefined);
    setShowViewAllPhotos(false, () =>
      getPhotos().then(res => {
        const pageCount = Math.ceil(res.data.totalCount / perPage);
        setPhotos(res.data.photos);
        setTotalCount(res.data.totalCount);
        setPageRange(pageCount <= 9 ? pageCount : 9);
      })
    );
  };

  // TODO: show loader for photo gallery
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.albumsContainer}>
          <h2 className={styles.albumsHeader}>Albums</h2>
          <nav>
            <ul className={styles.albumsMenu}>
              <li className={styles.albumsMenuItem}>
                <button onClick={handleAllAlbumsClick} type="button" className="btn btn-link">
                  All
                </button>{' '}
                |
              </li>
              <li className={styles.albumsMenuItem}>
                <button onClick={handleSharedAlbumsClick} type="button" className="btn btn-link">
                  Shared
                </button>
                |
              </li>
              <li className={styles.albumsMenuItem}>
                <button onClick={handlePrivateAlbumsClick} type="button" className="btn btn-link">
                  Private
                </button>
              </li>
            </ul>
          </nav>
          {albums.length ? (
            <AddAlbumLink />
          ) : (
            <React.Fragment>
              <p>You don't have any albums. Add one below.</p>
              <AddAlbumLink />
            </React.Fragment>
          )}
          {albums &&
            albums.map(album => {
              if (!album.photos.length) return null;

              return (
                <React.Fragment key={album._id}>
                  <img
                    onClick={handleAlbumClick}
                    data-id={album._id}
                    key={album._id}
                    className={styles.albumThumb}
                    src={`${process.env.GATSBY_API_URL}/images/${album.photos[0].userId}/thumbs/${album.photos[0].filename}`}
                    alt=""
                  />
                  <div className={styles.albumName}>{album.name}</div>
                  <ModalConfirm
                    modalButtonClassName={classnames('btn', 'btn-link', styles.deleteButton)}
                    confirmArgument={album._id}
                    onConfirm={deleteAlbum}
                    modalContent={<p>Are you sure you want to delete this album?</p>}
                    modalProps={{ triggerText: 'Delete' }}
                  />
                </React.Fragment>
              );
            })}
        </div>
        <div>
          <h2>Photo Gallery</h2>
          {showViewAllPhotos && (
            <p>
              <button className="btn btn-link" onClick={handleViewAllPhotosClick}>
                View All My Photos
              </button>
            </p>
          )}
          <p>
            <Link to="/photo-upload">Upload Photos</Link>
          </p>
          {albumName && <h3>Album: {albumName}</h3>}
          <div className={styles.thumbsGrid}>
            {photos.map(photo => {
              return (
                <div key={photo._id} className={styles.thumbContainer}>
                  <img
                    className={styles.thumb}
                    src={`${process.env.GATSBY_API_URL}/images/${photo.userId}/thumbs/${photo.filename}`}
                    alt=""
                  />
                  <ModalConfirm
                    modalButtonClassName={classnames('btn', 'btn-link', styles.deleteButton)}
                    confirmArgument={photo._id}
                    onConfirm={deletePhoto}
                    modalContent={<p>Are you sure you want to delete this photo?</p>}
                    modalProps={{ triggerText: 'Delete' }}
                  />
                </div>
              );
            })}
          </div>
          {pageRange > 1 && (
            <Pagination
              activePage={activePage}
              activeClass={styles.activePage}
              itemClass={styles.paginationItem}
              disabledClass={styles.disabled}
              itemsCountPerPage={perPage.current}
              totalItemsCount={totalCount}
              pageRangeDisplayed={pageRange}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuthentication(Photos);
