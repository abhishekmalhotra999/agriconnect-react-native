import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {ProgressView} from '@react-native-community/progress-view';
import {normalize} from '../../../utils/util';
import {useNavigation} from '@react-navigation/native';

const ProgressCard = () => {
  const navigation = useNavigation();
  const courseNavigationHandler = () => {
    navigation.navigate('Courses');
  };
  return (
    <View style={[styles.card, styles.progressContainer]}>
      <View style={styles.learnedToday}>
        <Text style={styles.learnedText}>Learned today</Text>
        <Text style={styles.timeText}>
          46min <Text style={styles.timeTextOutOf}>/ 60min</Text>
        </Text>
        <ProgressView
          progress={46 / 60}
          progressTintColor={COLORS.orange}
          trackTintColor="#F0F0F0"
          style={styles.progressBar}
        />
      </View>
      <TouchableOpacity
        style={styles.myCoursesBtn}
        onPress={courseNavigationHandler}>
        <Text style={styles.myCourses}>My courses</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    padding: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  learnedToday: {
    flex: 1,
  },
  learnedText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    paddingBottom: 4,
  },
  timeTextOutOf: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.grey,
  },
  timeText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.black,
  },
  progressBar: {
    marginTop: 10,
    height: 10,
  },
  myCoursesBtn: {
    alignSelf: 'flex-start',
  },
  myCourses: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.primary,
  },
});

export default ProgressCard;
