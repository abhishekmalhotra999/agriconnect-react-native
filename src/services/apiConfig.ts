import axios from 'axios';
// import { API_URL } from '@env';

import AsyncStorage from '@react-native-async-storage/async-storage';
import serializeError, { SerializedError } from '../utils/serializeError';

const API_URL='http://192.168.153.203:3000'

const api = axios.create({
  baseURL: API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(serializeError(error))
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serializedError: SerializedError = serializeError(error);

    if (serializedError.status === 401) {
      console.error('Unauthorized: Token may be invalid or expired.');
      // await AsyncStorage.removeItem('authToken');
    } else if (serializedError.status === 403) {
      console.error('Forbidden: You do not have the necessary permissions.');
    } else if (serializedError.status === 500) {
      console.error('Internal Server Error: Something went wrong on the server.');
    }

    if (!serializedError.status) {
      console.error('Network or client error: ', serializedError.message);
    }

    return Promise.reject(serializedError);
  }
);

export default api;
