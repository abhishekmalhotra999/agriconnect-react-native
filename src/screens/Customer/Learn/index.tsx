import React, {useRef, useEffect, useCallback, useState} from 'react';
import {StyleSheet, ScrollView, Platform, RefreshControl} from 'react-native';
import {LearnScreenProps} from '../../../navigation/types';
import Header from '../../../containers/header';
import {COLORS} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import AdsList from '../../../components/Customer/Learn/AdsList';
import Plan from '../../../components/Customer/Learn/Plan';
import ProgressCard from '../../../components/Customer/Learn/ProgressCard';
import GroupSession from '../../../components/Customer/Learn/GroupSession';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import {useScrollContext} from '../../../contexts/ScrollContext';
import {
  getAllCourses,
  getLesson,
  getLessonCompletionProgress,
} from '../../../api/learn.api';
import learnAction from '../../../store/slices/learn.slice';
import {useAppDispatch, useAppSelector} from '../../../store/storage';
import Loading from '../../../components/UI/Loading';

const Learn: React.FC<LearnScreenProps> = ({navigation}) => {
  useStatusBarStyle('dark-content', 'light-content');

  const scrollViewRef = useRef<ScrollView>(null);
  const {registerScrollRef} = useScrollContext();
  // const {user} = userContext();
  const dispatch = useAppDispatch();
  const authToken = useAppSelector(state => state.auth.authToken);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    registerScrollRef('Learn', scrollViewRef);
  }, [registerScrollRef]);

  const fetchAllCourseData = useCallback(async () => {
      try {
        const courses = await getAllCourses(authToken);
        dispatch(learnAction.saveAllCourses(courses));
        console.log('all courses', courses);
        const allLessonsObj = (courses || []).map(course => ({
          courseId: course.id,
          promise: getLesson(course.id, authToken),
        }));
        console.log('all courses', allLessonsObj);

        const allLessons = await Promise.all(
          allLessonsObj.map(lessonPromise => lessonPromise.promise),
        );

        console.log('all courses', allLessons);
        const completedLessons = await getLessonCompletionProgress();
        console.log('completed lessons', completedLessons);

        for (let index in allLessons) {
          const lessonsForCourse = Array.isArray(allLessons[index])
            ? allLessons[index]
            : [];
          const totalLessons = lessonsForCourse.length;

          const totalCompleted = lessonsForCourse.filter(lesson =>
            (completedLessons || []).some(
              cLesson => String(cLesson.lesson_id) === String(lesson.id),
            ),
          ).length;

          delete allLessonsObj[index].promise;
          allLessonsObj[index].completedLessons = totalCompleted;
          allLessonsObj[index].totalLessons = totalLessons;
        }
        dispatch(learnAction.saveProgress(allLessonsObj));
      } catch (error) {
        console.log(error);
      }
    }, [authToken, dispatch]);

  useEffect(() => {
    console.log('fetcing all courses');
    if (authToken) {
      fetchAllCourseData();
    }
  }, [authToken, fetchAllCourseData]);

  const onRefresh = useCallback(async () => {
    if (!authToken) {
      return;
    }

    setRefreshing(true);
    try {
      await fetchAllCourseData();
    } finally {
      setRefreshing(false);
    }
  }, [authToken, fetchAllCourseData]);

  return (
    <>
      <Header style={styles.header} mode="dark" />
      <ProgressCard />
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.bottomSpacing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Loading visible={refreshing} inline message="Refreshing learning data" />
        <AdsList />
        <Plan />
        <GroupSession />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.select({
      ios: normalize(48),
      android: normalize(50),
    }),
  },
  bottomSpacing: {
    paddingBottom: normalize(160),
  },
  header: {
    marginTop: Platform.select({
      ios: normalize(-55),
      android: normalize(-70),
    }),
    height: Platform.select({
      ios: normalize(220),
      android: normalize(240),
    }),
    backgroundColor: COLORS.primary,
  },
});

export default Learn;
