import api from './apiConfig';
import serializeError, { SerializedError } from '../utils/serializeError';

const ENDPOINT = '/api/marketplace';

export const fetchProductCategories = async (): Promise<any> => {
  try {
    const response = await api.get(`${ENDPOINT}/categories`);
    console.log("Product Categories:", response.data)
    return response.data;
  } catch (error) {
    const serializedError: SerializedError = serializeError(error);
    console.log('Error Product Categories:', serializedError);
    return serializedError;
  }
};