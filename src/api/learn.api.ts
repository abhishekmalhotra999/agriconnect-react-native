// import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const getAllCourses = async (authToken: string) => {
  try {
    console.log('auth token', authToken);
    const response = await apiClient.get('/api/courses', {
      headers: {
        Authorization: 'bearer ' + authToken,
      },
    });
    const data = response.data;

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getLesson = async (id: number, authToken: string) => {
  try {
    const response = await apiClient.get('/api/lessons', {
      headers: {
        Authorization: 'bearer ' + authToken,
      },
      params: {
        course_id: id,
      },
    });
    console.log('specific response', response);
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getLessonCompletionProgress = async () => {
  try {
    const response = await apiClient.get('api/lesson_progresses');
    console.log('priting response', response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateLessonProgress = async (id: number) => {
  try {
    const response = await apiClient.put('/api/lesson_progresses/' + id, {
      progress: 'completed',
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
