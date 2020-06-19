import axios from 'axios';

const ax = axios.create({
  baseURL: `${process.env.GATSBY_API_URL}/api/v1`,
  withCredentials: true,
});

export default ax;
