import axios from 'axios';

const ax = axios.create({
  // TODO: make configurable based on whether this is dev or production
  baseURL: `${process.env.GATSBY_API_URL}/api/v1`,
  withCredentials: true,
});

export default ax;
