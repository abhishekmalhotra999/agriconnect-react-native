import React, { useEffect, useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { BlogsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { COLORS } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import BlogList from '../../../components/Customer/Blog/BlogList';
import { useScrollContext } from '../../../contexts/ScrollContext';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';

const Blogs: React.FC<BlogsScreenProps> = () => {
  useStatusBarStyle('light-content', 'dark-content');
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();

  useEffect(() => {
    registerScrollRef('BLOGS_TAB', scrollViewRef);
  }, [registerScrollRef]);

  return (
    <>
    <Header />
      <ScrollView 
        ref={scrollViewRef}
        style={styles.container} 
        contentContainerStyle={styles.bottomSpacing}
      >
        <BlogList />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  bottomSpacing: {
    paddingBottom: normalize(120)
  },
});

export default Blogs;