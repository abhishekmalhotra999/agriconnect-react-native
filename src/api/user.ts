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
  try {
    console.log(data instanceof FormData);
    const response = await apiClient.put('/api/users/' + userId, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data.user;
  } catch (error) {
    console.log(error);
  }
};
