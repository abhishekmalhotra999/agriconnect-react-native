import React from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import CourseItem from './CourseItem';
import {normalize} from '../../../utils/util';
import {useAppSelector} from '../../../store/storage';
import {Course} from '../../../models/Course';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';

interface CourseListProps {
  courses?: Course[];
}

const CourseList: React.FC<CourseListProps> = ({courses: coursesProp}) => {
  const storeCourses = useAppSelector(state => state.learn.courses);
  const courses = coursesProp || storeCourses;

  if (!courses.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No courses found</Text>
        <Text style={styles.emptyText}>Try a different category or filter.</Text>
      </View>
    );
  }

  return (
    <FlatList
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      data={courses}
      renderItem={({item}) => <CourseItem item={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContainer}
      keyExtractor={item => String(item.id)}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: normalize(16),
    paddingBottom: normalize(120),
  },
  separator: {
    marginBottom: normalize(12),
  },
  emptyState: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(24),
  },
  emptyTitle: {
    color: COLORS.black,
    fontSize: FONT_SIZES.REGULAR,
    fontFamily: FONTS.medium,
    marginBottom: normalize(4),
  },
  emptyText: {
    color: COLORS.grey,
    fontSize: FONT_SIZES.SMALL,
    fontFamily: FONTS.regular,
  },
});

export default CourseList;
