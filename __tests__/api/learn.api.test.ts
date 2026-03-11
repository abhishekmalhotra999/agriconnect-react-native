import {
  getAllCourses,
  getLesson,
  getLessonCompletionProgress,
} from '../../src/api/learn.api';
import apiClient from '../../src/api/apiClient';

jest.mock('../../src/api/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
    defaults: {
      baseURL: 'http://localhost:3000',
    },
  },
}));

const mockedClient = apiClient as unknown as {
  get: jest.Mock;
  put: jest.Mock;
};

describe('learn.api', () => {
  beforeEach(() => {
    mockedClient.get.mockReset();
    mockedClient.put.mockReset();
  });

  it('maps course thumbnail/preview URLs to absolute paths', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: 'Soil Basics',
          thumbnailUrl: '/uploads/course-thumb.png',
          previewVideo: {url: '/uploads/preview.mp4', contentType: 'video'},
        },
      ],
    });

    const courses = await getAllCourses();

    expect(mockedClient.get).toHaveBeenCalledWith('/api/courses');
    expect(courses[0].thumbnailUrl).toBe(
      'http://localhost:3000/uploads/course-thumb.png',
    );
    expect(courses[0].previewVideo.url).toBe(
      'http://localhost:3000/uploads/preview.mp4',
    );
  });

  it('maps lessons with absolute asset and fallback content fields', async () => {
    mockedClient.get.mockResolvedValueOnce({
      data: [
        {
          id: 2,
          title: 'Lesson 1',
          content_html: '<p>HTML body</p>',
          content_plain: 'plain body',
          thumbnailUrl: '/uploads/lesson-thumb.png',
          asset: {url: '/uploads/lesson-image.png', contentType: 'image'},
        },
      ],
    });

    const lessons = await getLesson(10);

    expect(mockedClient.get).toHaveBeenCalledWith('/api/lessons', {
      params: {course_id: 10},
    });
    expect(lessons[0].content).toBe('<p>HTML body</p>');
    expect(lessons[0].contentPlain).toBe('plain body');
    expect(lessons[0].thumbnailUrl).toBe(
      'http://localhost:3000/uploads/lesson-thumb.png',
    );
    expect(lessons[0].asset.url).toBe(
      'http://localhost:3000/uploads/lesson-image.png',
    );
  });

  it('returns empty arrays on malformed responses', async () => {
    mockedClient.get.mockResolvedValueOnce({data: null});
    const courses = await getAllCourses();
    expect(courses).toEqual([]);

    mockedClient.get.mockResolvedValueOnce({data: undefined});
    const lessons = await getLesson(4);
    expect(lessons).toEqual([]);

    mockedClient.get.mockResolvedValueOnce({data: {}});
    const progress = await getLessonCompletionProgress();
    expect(progress).toEqual([]);
  });
});
