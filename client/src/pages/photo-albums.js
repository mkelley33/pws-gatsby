import React, { Component } from 'react';
import { toast } from 'react-toastify';
import classnames from 'classnames';
import { navigate } from 'gatsby';

import styles from './photo-album.module.css';

import api from '../api';
import Layout from '@components/layout';

export default class PhotoAlbum extends Component {
  state = {
    saved: false,
    isPublic: false,
  };

  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  handleCheckboxChange = changeEvent => {
    const { name } = changeEvent.target;

    this.setState(prevState => ({
      [name]: !prevState.isPublic,
    }));
  };

  handleSubmit = event => {
    event.preventDefault();
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/sign-in');
      return;
    }
    const userId = userData.userId;
    const data = {
      name: this.state.name,
      userId,
      isPublic: this.state.isPublic || false,
    };
    api.post('/photo-albums', data, { withCredentials: true }).then(response => {
      this.setState({
        saved: true,
        albumId: response.data._id,
      });
      toast.success(`Photo album ${response.data.name} was created successfully!`, {
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
      });
    });
  };

  handleUploadPicturesClick = event => {
    navigate(`/photo-upload?id=${this.state.albumId}`);
  };

  render() {
    return (
      <Layout>
        <h3>Create a Photo Album</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" className="form-control" onChange={this.handleChange} />
          </div>
          <div className="formGroup">
            <input name="isPublic" type="checkbox" id="isPublic" onChange={this.handleCheckboxChange} />{' '}
            <label htmlFor="isPublic">Is Public?</label>
          </div>
          <div>
            <button className="btn btn-primary" type="submit">
              Create Photo Album
            </button>
            {this.state.saved && (
              <button
                type="button"
                className={classnames('btn', 'btn-secondary', styles.btnSecondary)}
                onClick={this.handleUploadPicturesClick}
              >
                Upload Pictures
              </button>
            )}
          </div>
        </form>
      </Layout>
    );
  }
}
