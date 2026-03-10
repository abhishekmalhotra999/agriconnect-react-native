import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Pressable, Platform} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import NavigationService from '../../../navigation/navigationService';
import {useAppSelector} from '../../../store/storage';

const Plan = () => {
  const {courses, lessonsProgress} = useAppSelector(state => state.learn);
  const getProgress = useCallback(
    courseId => {
      console.log('course id', courseId);
      if (!courseId) return '';
      const lessonProgress = lessonsProgress.find(
        lp => lp.courseId === courseId,
      );
      console.log(lessonProgress);
      if (!lessonProgress) {
        return '';
      }
      return `${lessonProgress?.completedLessons}/${lessonProgress?.totalLessons}`;
    },
    [courses, lessonsProgress],
  );
  function goToCourses() {
    NavigationService.navigate('Courses');
  }

  return (
    <Pressable onPress={goToCourses} style={styles.learningPlan}>
      <Text style={styles.learningPlanTitle}>Learning Plan</Text>
      <View style={[styles.card, styles.content]}>
        {courses[0] ? (
          <View style={styles.learningItem}>
            <View style={styles.learningCircle} />
            <Text style={styles.learningText}>{courses[0]?.title}</Text>
            <Text style={styles.learningProgress}>
              {getProgress(courses[0]?.id)}
            </Text>
          </View>
        ) : null}
        {courses[1] ? (
          <View style={styles.learningItem}>
            <View style={styles.learningCircle} />
            <Text style={styles.learningText}>{courses[1]?.title}</Text>
            <Text style={styles.learningProgress}>
              {getProgress(courses[1]?.id)}
            </Text>
          </View>
        ) : null}
      </View>
      {/* <Text style={styles.learningProgress}>6/24</Text> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  learningPlan: {
    paddingHorizontal: normalize(16),
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  content: {
    backgroundColor: COLORS.white,
    // paddingBottom: normalize(30),
  },
  learningPlanTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontFamily: FONTS.medium,
    color: COLORS.eerieBlack,
    marginBottom: 10,
  },
  learningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: normalize(2),
    paddingBottom: normalize(15),
  },
  learningCircle: {
    width: 12,
    height: 12,
    marginTop: Platform.select({
      ios: normalize(-1),
      android: normalize(-2),
    }),
    backgroundColor: COLORS.orange,
    borderRadius: 6,
  },
  learningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  learningProgress: {
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONTS.medium,
    color: COLORS.grey,
  },
});

export default Plan;
