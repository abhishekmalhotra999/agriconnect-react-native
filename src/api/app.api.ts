import apiClient from './apiClient';

export const fetchPrivacyPolicy = async () => {
  try {
    const response = await apiClient.get('/api/contents', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log('checking response of privacy policy', response);
    const result = response.data;
    if (typeof result == 'string') {
      const resultingString = result.replaceAll('<br>', '');
      console.log('pritingldsjfds ', resultingString);
      return resultingString;
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};
