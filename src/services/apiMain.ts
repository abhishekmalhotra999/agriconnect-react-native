import api from './apiConfig';
import serializeError, { SerializedError } from '../utils/serializeError';

const ENDPOINT = '/api/v1/app'

export const fetchProductCategories = async (): Promise<any> => {
  try {
    const response = await api.get(`${ENDPOINT}/product_categories`);
    console.log("Product Categories:", response.data)
    return response.data;
  } catch (error) {
    const serializedError: SerializedError = serializeError(error);
    console.log('Error Product Categories:', serializedError);
    return serializedError;
  }
};