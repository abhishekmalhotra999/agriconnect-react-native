import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Course} from '../../../models/Course';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import {useNavigation} from '@react-navigation/native';
import {listItem1} from '../../../constants/images';
import {useAppSelector} from '../../../store/storage';

interface CourseProps {
  item: Course;
}

const CourseItem: React.FC<CourseProps> = ({item}) => {
  const navigation = useNavigation();
  const [imageFailed, setImageFailed] = useState(false);
  const lessonsProgress = useAppSelector(state => state.learn.lessonsProgress);

  const imageSource = useMemo(() => {
    if (!imageFailed && item.thumbnailUrl) {
      return {uri: item.thumbnailUrl};
    }

    return listItem1;
  }, [imageFailed, item.thumbnailUrl]);

  const courseProgress = useMemo(
    () =>
      lessonsProgress.find(
        progress => Number(progress.courseId) === Number(item.id),
      ),
    [item.id, lessonsProgress],
  );

  const completed = Number(courseProgress?.completedLessons || 0);
  const total = Number(courseProgress?.totalLessons || 0);
  const isEnrolled = completed > 0;
  const progressRatio = total > 0 ? Math.min(completed / total, 1) : 0;

  const courseClickHandler = () => {
    navigation.navigate('Lesson', {id: item.id});
  };
  return (
    <TouchableOpacity
      style={[styles.courseContainer, styles.card]}
      onPress={courseClickHandler}>
      <Image
        source={imageSource}
        style={styles.courseImage}
        onError={() => setImageFailed(true)}
        resizeMode={'cover'}
      />
      <View style={styles.courseDetails}>
        <Text style={styles.courseTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.courseAuthor}>{item.instructor}</Text>
        <View style={styles.inline}>
          <Text style={styles.coursePrice}>
            {item.price === '0' ? 'Free' : item.price}
          </Text>
          <View style={styles.courseDuration}>
            <Text style={styles.courseDurationText}>{item.duration}</Text>
          </View>
        </View>
        {isEnrolled ? (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressCount}>{`${completed}/${total}`}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.max(progressRatio * 100, 6)}%`},
                ]}
              />
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 18,
    padding: normalize(12),
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.grey,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseImage: {
    width: normalize(88),
    height: normalize(88),
    borderRadius: 14,
    backgroundColor: COLORS.lightGrey,
  },
  courseDetails: {
    marginLeft: normalize(12),
    justifyContent: 'space-around',
    flex: 1,
  },
  courseTitle: {
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    width: '100%',
    lineHeight: normalize(24),
  },
  courseAuthor: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    paddingVertical: 5,
  },
  coursePrice: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
  },
  courseDuration: {
    paddingHorizontal: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    marginLeft: 5,
  },
  courseDurationText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
  progressSection: {
    marginTop: normalize(8),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  progressLabel: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  progressCount: {
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  progressTrack: {
    height: normalize(6),
    borderRadius: normalize(3),
    backgroundColor: COLORS.lightGrey,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: normalize(3),
  },
});

export default CourseItem;
