import api from './apiConfig';
import serializeError, { SerializedError } from '../utils/serializeError';

const ENDPOINT = '/api/v1/user'


export const register = async (data: any): Promise<any> => {
  try {
    const response = await api.post(`${ENDPOINT}/register`, data);
    console.log("Success register:", response.data)
    return response.data;
  } catch (error) {
    const serializedError: SerializedError = serializeError(error);
    console.log('Error register:', serializedError);
    return serializedError;
  }
};

export const sendOTP = async (data: any): Promise<any> => {
  try {
    const response = await api.post(`${ENDPOINT}/otp-login`, data);
    console.log("Success sendOTP:", response.data)
    return response.data;
  } catch (error) {
    const serializedError: SerializedError = serializeError(error);
    console.log('Error sendOTP:', serializedError);
    return serializedError;
  }
};

export const verifyOTP = async (data: any): Promise<any> => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImZvcm9wZW5tZSI6dHJ1ZX0sImlhdCI6MTcxNzA5ODY0N30.sHI2Vw0OBGpg0N7rf4CgoJTPUXuR0u3Yozko7lGSjes'
    const response = await api.post(`${ENDPOINT}/verify-otp`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Success verifyOTP:", response.data)
    return response.data;
  } catch (error) {
    const serializedError: SerializedError = serializeError(error);
    console.log('Error verifyOTP:', serializedError);
    return serializedError;
  }
};

export const login = async (data: any): Promise<any> => {
  try {
    const response = await api.post(`${ENDPOINT}/password-login`, data);
    console.log("Success password login:", response.data)
    return response.data;
  } catch (error) {
    const serializedError: SerializedError = serializeError(error);
    console.log('Error password login:', serializedError);
    return serializedError;
  }
};