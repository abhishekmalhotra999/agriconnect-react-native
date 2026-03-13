import {Asset} from 'react-native-image-picker';
import apiClient from './apiClient';
export type UserDetailUpdatePayload = {
  name: string;
  email: string;
  address: string;
  yearsOfExperience: number;
  farmSize: string;
  professionType: string;
  file: Asset;
};

export const updateUserDetail = async (userId: number, data: FormData) => {
  const response = await apiClient.put('/api/users/' + userId, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.user;
};

export const getCurrentUserDetail = async () => {
  const response = await apiClient.get('/api/users/me');
  return response.data.user;
};
