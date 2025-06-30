// src/api/index.js
// export const API_BASE_URL = 'http://157.49.0.12:5000/';
import axios from 'axios';
export const API_BASE_URL = 'http://10.0.2.2:5000';

const client = axios.create({
  baseURL: API_BASE_URL,
});

export default client;

export { default as authApi }    from './auth';
export { default as matchesApi } from './matches';
export { default as invitesApi } from './invites';