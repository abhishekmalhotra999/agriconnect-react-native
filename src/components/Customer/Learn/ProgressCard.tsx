import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../../store/storage';

const ProgressCard = () => {
  const navigation = useNavigation();
  const lessonsProgress = useAppSelector(state => state.learn.lessonsProgress);

  const overall = useMemo(() => {
    if (!Array.isArray(lessonsProgress) || lessonsProgress.length === 0) {
      return {
        completedLessons: 0,
        totalLessons: 0,
        completedCourses: 0,
        activeCourses: 0,
        progressPercent: 0,
      };
    }

    const summary = lessonsProgress.reduce(
      (acc, item) => {
        const completed = Number(item?.completedLessons || 0);
        const total = Number(item?.totalLessons || 0);
        const boundedCompleted = Math.min(completed, total);

        return {
          completedLessons: acc.completedLessons + boundedCompleted,
          totalLessons: acc.totalLessons + total,
          completedCourses:
            acc.completedCourses + (total > 0 && boundedCompleted >= total ? 1 : 0),
          activeCourses:
            acc.activeCourses + (total > 0 && boundedCompleted > 0 && boundedCompleted < total ? 1 : 0),
        };
      },
      {
        completedLessons: 0,
        totalLessons: 0,
        completedCourses: 0,
        activeCourses: 0,
      },
    );

    const progressPercent =
      summary.totalLessons > 0
        ? Math.round((summary.completedLessons / summary.totalLessons) * 100)
        : 0;

    return {
      ...summary,
      progressPercent,
    };
  }, [lessonsProgress]);

  const progressRatio = Math.max(
    0,
    Math.min(
      overall.totalLessons > 0
        ? overall.completedLessons / overall.totalLessons
        : 0,
      1,
    ),
  );
  const fillWidthPercent =
    overall.totalLessons > 0 ? Math.max(progressRatio * 100, 4) : 0;

  const courseNavigationHandler = () => {
    navigation.navigate('Courses');
  };

  return (
    <View style={[styles.card, styles.progressContainer]}>
      <View style={styles.headerRow}>
        <View style={styles.learnedToday}>
          <Text style={styles.learnedText}>Overall progress</Text>
          <Text style={styles.timeText}>
            {overall.completedLessons}
            <Text style={styles.timeTextOutOf}>/{overall.totalLessons} lessons</Text>
          </Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{overall.progressPercent}%</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${fillWidthPercent}%`}]} />
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.summaryText}>
          {overall.activeCourses} active • {overall.completedCourses} completed
        </Text>
        <TouchableOpacity
          style={styles.myCoursesBtn}
          onPress={courseNavigationHandler}>
          <Text style={styles.myCourses}>My courses</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: Platform.select({
      ios: normalize(104),
      android: normalize(90),
    }),
    zIndex: 1,
    margin: normalize(16),
  },
  card: {
    borderRadius: 15,
    paddingVertical: normalize(14),
    paddingHorizontal: normalize(16),
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learnedToday: {
    flex: 1,
  },
  learnedText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginBottom: normalize(4),
  },
  timeTextOutOf: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
  timeText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MLARGE,
    color: COLORS.darkText,
  },
  percentBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: normalize(14),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
  },
  percentText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
  progressTrack: {
    width: '100%',
    height: normalize(8),
    backgroundColor: '#EFEFEF',
    borderRadius: normalize(20),
    marginTop: normalize(12),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: normalize(20),
    backgroundColor: COLORS.orange,
  },
  footerRow: {
    marginTop: normalize(10),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  myCoursesBtn: {
    borderRadius: normalize(12),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    backgroundColor: COLORS.primaryLight,
  },
  myCourses: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.primary,
  },
});

export default ProgressCard;
