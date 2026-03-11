// import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

const normalizeAssetUrl = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  if (value.indexOf('http://') === 0 || value.indexOf('https://') === 0) {
    return value;
  }

  const base = String(apiClient.defaults.baseURL || '').replace(/\/$/, '');
  if (!base) {
    return value;
  }

  return `${base}${value.indexOf('/') === 0 ? value : `/${value}`}`;
};

const mapCourse = (course: any) => {
  const thumbnail = normalizeAssetUrl(course?.thumbnailUrl || course?.thumbnail_url);
  const previewUrl = normalizeAssetUrl(
    course?.previewVideo?.url || course?.preview_video?.url,
  );

  return {
    ...course,
    thumbnailUrl: thumbnail,
    previewVideo: course?.previewVideo
      ? {
          ...course.previewVideo,
          url: previewUrl,
        }
      : course?.preview_video
      ? {
          ...course.preview_video,
          url: previewUrl,
        }
      : undefined,
  };
};

const mapLesson = (lesson: any) => {
  const assetUrl = normalizeAssetUrl(lesson?.asset?.url || lesson?.lesson_asset);

  return {
    ...lesson,
    content: lesson?.content ?? lesson?.content_html ?? '',
    contentPlain: lesson?.contentPlain ?? lesson?.content_plain ?? '',
    thumbnailUrl: normalizeAssetUrl(lesson?.thumbnailUrl || lesson?.thumbnail_url),
    asset: lesson?.asset
      ? {
          ...lesson.asset,
          url: assetUrl,
        }
      : assetUrl
      ? {
          url: assetUrl,
          contentType: 'image',
        }
      : null,
  };
};

export const getAllCourses = async (_authToken?: string) => {
  try {
    const response = await apiClient.get('/api/courses');
    const courses = Array.isArray(response.data) ? response.data : [];
    return courses.map(mapCourse);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getLesson = async (id: number, _authToken?: string) => {
  try {
    const response = await apiClient.get('/api/lessons', {
      params: {
        course_id: id,
      },
    });

    const lessons = Array.isArray(response.data) ? response.data : [];
    return lessons.map(mapLesson);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getLessonCompletionProgress = async (_courseId?: number) => {
  try {
    const response = await apiClient.get('/api/lesson_progresses');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateLessonProgress = async (id: number) => {
  try {
    const response = await apiClient.put('/api/lesson_progresses/' + id, {
      completed: true,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
