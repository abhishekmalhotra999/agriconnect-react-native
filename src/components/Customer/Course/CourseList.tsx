import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import CourseItem from './CourseItem';
import {normalize} from '../../../utils/util';
import {useAppSelector} from '../../../store/storage';

const CourseList = () => {
  const courses = useAppSelector(state => state.learn.courses);
  console.log('printing courses', courses);
  return (
    <FlatList
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      data={courses}
      renderItem={({item}) => <CourseItem item={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContainer}
      keyExtractor={item => item.title}
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
});

export default CourseList;
