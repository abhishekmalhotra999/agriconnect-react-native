import React, {useMemo, useState} from 'react';
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
import {useAppSelector} from '../../../store/storage';
import {Course} from '../../../models/Course';

const options = ['All', 'Popular', 'New'];
const categoryOptions = ['All', 'Farming', 'Cycles'] as const;
type CategoryOption = (typeof categoryOptions)[number];

const getCourseCategory = (course: Course): CategoryOption => {
  const rawCategory = String(
    (course as Record<string, unknown>).category ||
      (course as Record<string, unknown>).categoryName ||
      (course as Record<string, unknown>).category_name ||
      '',
  ).toLowerCase();

  const content = `${course.title || ''} ${course.description || ''} ${rawCategory}`.toLowerCase();

  if (content.indexOf('cycle') >= 0 || content.indexOf('rotation') >= 0) {
    return 'Cycles';
  }

  return 'Farming';
};

const Courses: React.FC<CoursesScreenProps> = ({navigation}) => {
  useStatusBarStyle('light-content', 'dark-content');

  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState<CategoryOption>('All');
  const courses = useAppSelector(state => state.learn.courses);

  const filteredCourses = useMemo(() => {
    let nextCourses = courses;

    if (activeCategory !== 'All') {
      nextCourses = nextCourses.filter(course => getCourseCategory(course) === activeCategory);
    }

    if (activeFilter === 'Popular') {
      nextCourses = nextCourses.slice(0, 5);
    }

    if (activeFilter === 'New') {
      nextCourses = nextCourses
        .slice()
        .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
        .slice(0, 5);
    }

    return nextCourses;
  }, [activeCategory, activeFilter, courses]);

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
                isActive={activeCategory === 'Farming'}
                onPress={() => setActiveCategory(prev => (prev === 'Farming' ? 'All' : 'Farming'))}
              />
              <ImageCard
                imageSource={wateringPlant}
                tag="Cycles"
                themeColor={COLORS.cyan}
                textColor={COLORS.textPurple}
                isActive={activeCategory === 'Cycles'}
                onPress={() => setActiveCategory(prev => (prev === 'Cycles' ? 'All' : 'Cycles'))}
              />
            </View>
          </>
        }>
        <Filters
          title="Choose your courses"
          options={options}
          itemStyle={styles.itemStyle}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <CourseList courses={filteredCourses} />
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
    marginTop: normalize(16),
    marginBottom: normalize(24),
    paddingHorizontal: normalize(16),
  },
  itemStyle: {
    width: '55%',
  },
});

export default Courses;
