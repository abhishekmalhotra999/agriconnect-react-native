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
import FastImage from '@d11/react-native-fast-image';
import {normalize} from '../../../utils/util';
import {useNavigation} from '@react-navigation/native';

interface CourseProps {
  item: Course;
}

const CourseItem: React.FC<CourseProps> = ({item}) => {
  const navigation = useNavigation();
  const courseClickHandler = () => {
    navigation.navigate('Lesson', {id: item.id});
  };
  return (
    <TouchableOpacity
      style={[styles.courseContainer, styles.card]}
      onPress={courseClickHandler}>
      <Image
        // @ts-ignore
        source={item.thumbnailUrl ? {uri: item.thumbnailUrl} : undefined}
        style={styles.courseImage}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.courseDetails}>
        <Text style={styles.courseTitle} numberOfLines={1} ellipsizeMode="tail">
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
    borderRadius: 15,
    padding: normalize(10),
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseImage: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: 10,
    resizeMode: 'contain',
  },
  courseDetails: {
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  courseTitle: {
    color: COLORS.black,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    // flex: 1,
    width: 230,
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
