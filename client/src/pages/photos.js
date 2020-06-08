import React, { Component } from 'react';
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

class Photos extends Component {
  state = {
    photos: [],
    albums: [],
    pageCount: 1,
    pageRange: 1,
    perPage: 9,
    offset: 0,
  };

  getPhotos = id => {
    if (this.state.isAlbumClick) {
      return api.get(`/photo-albums/${id}`, { params: { limit: this.state.perPage, skip: this.state.offset } });
    } else {
      return api.get('/photos', { params: { limit: this.state.perPage, skip: this.state.offset } });
    }
  };

  handlePrivateAlbumsClick = () => {
    api.get('/photo-albums/', { params: { isPublic: false } }).then(response => {
      this.setState({ albums: response.data });
    });
  };

  handleSharedAlbumsClick = () => {
    api.get('/photo-albums/', { params: { isPublic: true } }).then(response => {
      this.setState({ albums: response.data });
    });
  };

  handleAllAlbumsClick = () => {
    api.get('/photo-albums/').then(response => {
      this.setState({ albums: response.data });
    });
  };

  componentDidMount() {
    Promise.all([this.getPhotos(), api.get('/photo-albums')])
      .then(res => {
        const pageCount = Math.ceil(res[0].data.totalCount / this.state.perPage);
        this.setState({
          photos: res[0].data.photos,
          totalCount: res[0].data.totalCount,
          pageCount,
          pageRange: pageCount <= 9 ? pageCount : 9,
          albums: res[1].data,
        });
      })
      .catch(err => {
        toast.error('Something went wrong', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
        });
      });
  }

  deletePhoto = id => {
    api.delete(`/photos/${id}`).then(res => {
      const photoIndex = this.state.photos.findIndex(photo => {
        return photo._id === id;
      });
      const photos = [...this.state.photos];
      photos.splice(photoIndex, 1);
      this.setState({ photos });
      toast.success('You successfully deleted the photo', {
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
      });
    });
  };

  deleteAlbum = id => {
    api.delete(`/photo-albums/${id}`).then(res => {
      const albumIndex = this.state.albums.findIndex(album => {
        return album._id === id;
      });
      const albums = [...this.state.albums];
      albums.splice(albumIndex, 1);
      this.setState({ albums });
      this.handleViewAllPhotosClick();
    });
  };

  handleAlbumClick = event => {
    const { id } = event.target.dataset;
    this.setState({ offset: 0, activePage: 1, isAlbumClick: true, albumId: id, showViewAllPhotos: true }, () => {
      this.getPhotos(id).then(res => {
        const pageCount = Math.ceil(res.data.totalCount / this.state.perPage);
        this.setState({
          photos: res.data.photos.map(photo => photo.photos),
          totalCount: res.data.totalCount,
          pageRange: pageCount <= 9 ? pageCount : 9,
          albumName: res.data.photos[0].name,
        });
      });
    });
  };

  handlePageChange = pageNumber => {
    const offset = (pageNumber - 1) * this.state.perPage;
    this.setState({ offset, activePage: pageNumber }, () => {
      this.getPhotos(this.state.albumId).then(res => {
        if (res.data && res.data.photos && res.data.photos[0] && res.data.photos[0].photos) {
          this.setState({
            photos: res.data.photos.map(photo => photo.photos),
            totalCount: res.data.totalCount,
          });
        } else {
          this.setState({
            photos: res.data.photos,
            totalCount: res.data.totalCount,
          });
        }
      });
    });
  };

  handleViewAllPhotosClick = () => {
    this.setState({ albumId: undefined, isAlbumClick: false, albumName: undefined, showViewAllPhotos: false }, () =>
      this.getPhotos().then(res => {
        const pageCount = Math.ceil(res.data.totalCount / this.state.perPage);
        this.setState({
          photos: res.data.photos,
          totalCount: res.data.totalCount,
          pageCount,
          pageRange: pageCount <= 9 ? pageCount : 9,
        });
      })
    );
  };

  render() {
    // TODO: show loader for photo gallery
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.albumsContainer}>
            <h2 className={styles.albumsHeader}>Albums</h2>
            <nav>
              <ul className={styles.albumsMenu}>
                <li className={styles.albumsMenuItem}>
                  <button onClick={this.handleAllAlbumsClick} type="button" className="btn btn-link">
                    All
                  </button>{' '}
                  |
                </li>
                <li className={styles.albumsMenuItem}>
                  <button onClick={this.handleSharedAlbumsClick} type="button" className="btn btn-link">
                    Shared
                  </button>
                  |
                </li>
                <li className={styles.albumsMenuItem}>
                  <button onClick={this.handlePrivateAlbumsClick} type="button" className="btn btn-link">
                    Private
                  </button>
                </li>
              </ul>
            </nav>
            {this.state.albums.length ? (
              <AddAlbumLink />
            ) : (
              <React.Fragment>
                <p>You don't have any albums. Add one below.</p>
                <AddAlbumLink />
              </React.Fragment>
            )}
            {this.state.albums &&
              this.state.albums.map(album => {
                if (!album.photos.length) return;

                return (
                  <React.Fragment key={album._id}>
                    <img
                      onClick={this.handleAlbumClick}
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
                      onConfirm={this.deleteAlbum}
                      modalContent={<p>Are you sure you want to delete this album?</p>}
                      modalProps={{ triggerText: 'Delete' }}
                    />
                  </React.Fragment>
                );
              })}
          </div>
          <div>
            <h2>Photo Gallery</h2>
            {this.state.showViewAllPhotos && (
              <p>
                <button className="btn btn-link" onClick={this.handleViewAllPhotosClick}>
                  View All My Photos
                </button>
              </p>
            )}
            <p>
              <Link to="/photo-upload">Upload Photos</Link>
            </p>
            {this.state.albumName && <h3>Album: {this.state.albumName}</h3>}
            <div className={styles.thumbsGrid}>
              {this.state.photos.map(photo => {
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
                      onConfirm={this.deletePhoto}
                      modalContent={<p>Are you sure you want to delete this photo?</p>}
                      modalProps={{ triggerText: 'Delete' }}
                    />
                  </div>
                );
              })}
            </div>
            {this.state.pageRange > 1 && (
              <Pagination
                activePage={this.state.activePage}
                activeClass={styles.activePage}
                itemClass={styles.paginationItem}
                disabledClass={styles.disabled}
                itemsCountPerPage={this.state.perPage}
                totalItemsCount={this.state.totalCount}
                pageRangeDisplayed={this.state.pageRange}
                onChange={this.handlePageChange}
              />
            )}
          </div>
        </div>
      </Layout>
    );
  }
}

export default withAuthentication(Photos);
