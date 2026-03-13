import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {Platform} from 'react-native';

const DEFAULT_API_URL = 'http://localhost:3000';

const rawBaseUrl = (API_URL || DEFAULT_API_URL).replace(/\/$/, '');

const normalizedBaseUrl =
  Platform.OS === 'android'
    ? rawBaseUrl
        .replace('://localhost', '://10.0.2.2')
        .replace('://127.0.0.1', '://10.0.2.2')
    : rawBaseUrl;

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
