import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {Course} from '../../../models/Course';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import {useNavigation} from '@react-navigation/native';
import {listItem1} from '../../../constants/images';

interface CourseProps {
  item: Course;
}

const CourseItem: React.FC<CourseProps> = ({item}) => {
  const navigation = useNavigation();
  const imageSource = item.thumbnailUrl ? {uri: item.thumbnailUrl} : listItem1;

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
});

export default CourseItem;
