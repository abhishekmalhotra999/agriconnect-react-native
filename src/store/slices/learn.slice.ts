import {createSlice} from '@reduxjs/toolkit';
import {completedLesson, Course, Lesson} from '../../models/Course';

type InitialState = {
  courses: Course[];
  lessons: Lesson[];
  completedLessons: completedLesson[];
  lessonsProgress: {
    courseId: number;
    completedLessons: number;
    totalLessons: number;
  }[];
};

const initialState: InitialState = {
  courses: [],
  lessons: [],
  completedLessons: [],
  lessonsProgress: [],
};

const learnSlice = createSlice({
  name: 'learn',
  initialState,
  reducers: {
    saveAllCourses: (state, action) => {
      console.log('action', action.payload);
      state.courses = action.payload;
    },
    saveAllLessons: (state, action) => {
      state.lessons = action.payload;
    },
    saveCompletedLessons: (state, action) => {
      state.completedLessons = action.payload;
    },
    addCompletedLesson: (state, action) => {
      state.completedLessons.push(action.payload);
    },
    saveProgress: (state, action) => {
      state.lessonsProgress = action.payload;
    },
    incrementLessonProgress: (state, action) => {
      const courseProgressIndex = state.lessonsProgress.findIndex(
        lessonDetail => lessonDetail.courseId === action.payload.courseId,
      );
      if (courseProgressIndex < 0) {
        return;
      }
      const updatedCourseProgress = state.lessonsProgress[courseProgressIndex];
      updatedCourseProgress.completedLessons += 1;
      state.lessonsProgress.splice(
        courseProgressIndex,
        1,
        updatedCourseProgress,
      );
    },
  },
});

export const learnReducer = learnSlice.reducer;
export default learnSlice.actions;
