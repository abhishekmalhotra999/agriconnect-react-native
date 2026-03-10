import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://104.248.246.180',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

apiClient.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('authToken');
  console.log(config);
  if (!token) {
    return config;
  }
  if (config.headers['Content-Type'] != 'multipart/form-data') {
    config.headers['Content-Type'] = 'application/json';
  }
  config.headers.Authorization = 'bearer ' + token;
  return config;
});

export default apiClient;
