import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

interface ILoginBody {
  phone: string;
  password: string;
}

interface ISendOtp {
  phone: string;
  name: string;
  accountType: string;
}

interface IVerifyOtp {
  phone: string;
  verificationCode: string;
}

interface ISignupBody {
  phone: string;
  email: string;
  address: string;
  professionType: string;
  password?: string;
  confirmPassword?: string;
  farmSize?: string;
  farmType?: string;
  technicianType?: string;
  yearsOfExperience?: string;
}

export async function loginHandler(body: ILoginBody): Promise<any> {
  try {
    const response = await apiClient.post('/api/sign_in', body);
    const data = response.data;
    console.log('printing out the data', data);
    if (data.user) {
      await AsyncStorage.setItem('authToken', data.user.jwtToken);
    }

    // await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.log('error', error);
  }
}

export async function sendOtp(body: ISendOtp) {
  try {
    const response = await apiClient.post('/api/get_otp', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    console.log('printing out the data1', data);
    // await AsyncStorage.setItem('authToken', data.user.jwtToken);

    // await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
export async function verifyOtp(body: IVerifyOtp) {
  try {
    const response = await apiClient.post('/api/auth_user', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    console.log('printing out the data', data);
    // await AsyncStorage.setItem('authToken', data.user.jwtToken);

    // await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.log('error', error);
  }
}

export async function signup(body: ISignupBody) {
  try {
    const response = await apiClient.post('/api/sign_up', body);
    const data = response.data;
    console.log('dataaaaa', data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
}
