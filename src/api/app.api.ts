import apiClient from './apiClient';

export const fetchPrivacyPolicy = async () => {
  try {
    const response = await apiClient.get('/api/contents');
    const result = response.data;

    if (typeof result == 'string') {
      const resultingString = result.replaceAll('<br>', '');
      return resultingString;
    }

    if (typeof result?.content === 'string') {
      return result.content;
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};
