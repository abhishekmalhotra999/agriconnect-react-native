import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';

const DEFAULT_API_URL = 'http://localhost:3000';

const normalizedBaseUrl = (API_URL || DEFAULT_API_URL).replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 10000,
});

apiClient.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('authToken');

  const contentType = config.headers['Content-Type'];
  const isMultipart = contentType === 'multipart/form-data';

  if (!isMultipart && !contentType) {
    config.headers['Content-Type'] = 'application/json';
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
