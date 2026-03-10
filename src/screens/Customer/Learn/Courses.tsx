import React, {useState} from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {CoursesScreenProps} from '../../../navigation/types';
import Header from '../../../containers/header';
import {COLORS} from '../../../themes/styles';
import {normalize, headerHeight} from '../../../utils/util';
import SearchBar from '../../../components/UI/SearchBar';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import CourseList from '../../../components/Customer/Course/CourseList';
import Filters from '../../../components/UI/Filters';
import ImageCard from '../../../components/Customer/Course/ImageCard';
import {wateringPlant, mining} from '../../../constants/images';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import Separator from '../../../components/UI/Separator';
// import { useSelector } from 'react-redux';
// import {useAppSelector} from '../../../store/storage';

const options = ['All', 'Popular', 'New'];

const Courses: React.FC<CoursesScreenProps> = ({navigation}) => {
  useStatusBarStyle('light-content', 'dark-content');

  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView
        headerHeight={headerHeight(170, 180)}
        headerContent={
          <>
            <SearchBar placeholder="Find Course" />
            <View style={styles.imageCardContainer}>
              <ImageCard
                imageSource={mining}
                tag="Farming"
                themeColor={COLORS.brown}
                textColor={COLORS.primary}
              />
              <ImageCard
                imageSource={wateringPlant}
                tag="Cycles"
                themeColor={COLORS.cyan}
                textColor={COLORS.textPurple}
              />
            </View>
          </>
        }>
        <Filters
          title="Choice your courses"
          options={options}
          itemStyle={styles.itemStyle}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <CourseList />
      </AnimatedHeaderScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imageCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(20),
    marginBottom: normalize(35),
    paddingHorizontal: normalize(16),
  },
  itemStyle: {
    width: '55%',
  },
});

export default Courses;
