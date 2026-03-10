import axios from 'axios';

export interface SerializedError {
  message: string;
  status?: number;
  data?: any;
}

const serializeError = (error: any): SerializedError => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        message: 'No response received from server',
      };
    } else {
      return {
        message: error.message,
      };
    }
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
};

export default serializeError;