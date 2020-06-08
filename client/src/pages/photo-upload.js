import React, { Component } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { css } from '@emotion/core';
import styles from './photo-upload.module.css';
import { connect } from 'react-redux';
import FadeLoader from 'react-spinners/FadeLoader';
import * as qs from 'query-string';
import { navigate } from 'gatsby';

import { signOutUser } from '../actions/index';
import api from '../api';
import Layout from '@components/layout';

class Thumb extends Component {
  state = {
    loading: false,
    thumb: undefined,
    isPublic: false,
  };

  componentDidMount() {
    if (!this.props.file) {
      return;
    }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };
      reader.readAsDataURL(this.props.file);
    });
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) {
      return null;
    }

    if (loading) {
      return <p>loading...</p>;
    }

    return <img src={thumb} alt={file.name} className="img-thumbnail" height={100} width={100} />;
  }
}

class PhotoUpload extends Component {
  state = {
    files: [],
    requestPending: false,
  };

  handleUploadImage = ev => {
    ev.preventDefault();
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/sign-in');
      return;
    }
    const { userId } = userData;
    const uploaders = this.state.files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('albumId', qs.parse(window.location.search).id);
      this.setState({ requestPending: true, isPublic: this.state.isPublic });
      return api
        .post('/photos/upload', formData, {
          withCredentials: true,
        })
        .catch(error => {
          if (error.response && error.response.status === 415) {
            this.setState({ errors: error.response.data.errors });
          } else if (error.response && error.response.status === 403) {
            throw error;
          }
        });
    });

    axios
      .all(uploaders)
      .then(() => {
        this.setState({ requestPending: false });
        navigate('/photos');
      })
      .catch(error => {
        this.setState({ requestPending: false });
        if (error.response && error.response.status === 403) {
          this.props.signOutUser();
          navigate('/sign-in');
        }
      });
  };

  handleAcceptedFiles = acceptedFiles => {
    this.setState({
      files: [...this.state.files, ...acceptedFiles],
    });
  };

  handleIsPublicChange = event => {
    const { name } = event.target;

    this.setState(prevState => ({
      [name]: !prevState.isPublic,
    }));
  };

  render() {
    const override = css`
      display: block;
      margin: 0 auto;
    `;

    return (
      <Layout>
        <div className="container">
          <FadeLoader
            css={override}
            sizeUnit={'rem'}
            size={15}
            color={'lightblue'}
            loading={this.state.requestPending}
          />
          <Dropzone accept="image/*" onDrop={acceptedFiles => this.handleAcceptedFiles(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div className={styles.dropZone} {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                  {this.state.files.length > 0 && this.state.files.map((file, i) => <Thumb key={i} file={file} />)}
                </div>
              </section>
            )}
          </Dropzone>
          <form onSubmit={this.handleUploadImage}>
            <div>
              <input id="isPublic" type="checkbox" name="isPublic" onChange={this.handleIsPublicChange}></input>{' '}
              <label htmlFor="isPublic">Is Public?</label>
            </div>
            <button className="btn btn-success" type="submit">
              Upload
            </button>
            {this.state.errors && this.state.errors.file && <div className="text-danger">{this.state.errors.file}</div>}
          </form>
        </div>
      </Layout>
    );
  }
}

export default connect(
  null,
  { signOutUser }
)(PhotoUpload);
