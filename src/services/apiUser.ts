import api from './apiConfig';
import serializeError, { SerializedError } from '../utils/serializeError';

const ENDPOINT = '/api';


export const register = async (data: any): Promise<any> => {
  try {
    const response = await api.post(`${ENDPOINT}/sign_up`, data);
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
    const response = await api.post(`${ENDPOINT}/get_otp`, data);
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
    const response = await api.post(`${ENDPOINT}/auth_user`, data);
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
    const payload = {
      identifier: data?.identifier || data?.phone || data?.email,
      password: data?.password,
    };
    const response = await api.post(`${ENDPOINT}/sign_in`, payload);
    console.log("Success password login:", response.data)
    return response.data;
  } catch (error) {
    const serializedError: SerializedError = serializeError(error);
    console.log('Error password login:', serializedError);
    return serializedError;
  }
};