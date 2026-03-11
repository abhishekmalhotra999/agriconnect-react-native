import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
  name?: string;
  phone: string;
  email: string;
  address: string;
  professionType: string;
  password?: string;
  confirmPassword?: string;
  farmSize?: string;
  farmingType?: string;
  technicianType?: string;
  yearsOfExperience?: string;
}

type ApiResult<T = any> = T & {
  errors?: string;
};

const normalizeAccountType = (accountType: string): string => {
  return accountType.trim().toLowerCase();
};

const parseApiError = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong. Please try again.';
  }

  const payload = error.response?.data as
    | {errors?: string | string[]; message?: string}
    | undefined;

  if (Array.isArray(payload?.errors)) {
    return payload.errors.join(', ');
  }

  if (typeof payload?.errors === 'string') {
    return payload.errors;
  }

  if (typeof payload?.message === 'string') {
    return payload.message;
  }

  return 'Unable to connect to the server.';
};

export async function loginHandler(body: ILoginBody): Promise<ApiResult> {
  try {
    const response = await apiClient.post('/api/sign_in', {
      identifier: body.phone,
      password: body.password,
    });
    const data = response.data;

    if (data.user) {
      await AsyncStorage.setItem('authToken', data.user.jwtToken);
    }

    return data;
  } catch (error) {
    return {
      errors: parseApiError(error),
    };
  }
}

export async function sendOtp(body: ISendOtp): Promise<ApiResult> {
  try {
    const response = await apiClient.post('/api/get_otp', {
      ...body,
      accountType: normalizeAccountType(body.accountType),
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    return {
      errors: parseApiError(error),
    };
  }
}
export async function verifyOtp(body: IVerifyOtp): Promise<ApiResult> {
  try {
    const response = await apiClient.post('/api/auth_user', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    return {
      errors: parseApiError(error),
    };
  }
}

export async function signup(body: ISignupBody): Promise<ApiResult> {
  try {
    const response = await apiClient.post('/api/sign_up', body);
    return response.data;
  } catch (error) {
    return {
      errors: parseApiError(error),
    };
  }
}
