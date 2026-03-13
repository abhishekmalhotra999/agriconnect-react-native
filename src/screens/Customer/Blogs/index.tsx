import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, ScrollView, RefreshControl} from 'react-native';
import { BlogsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { COLORS } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import BlogList from '../../../components/Customer/Blog/BlogList';
import { useScrollContext } from '../../../contexts/ScrollContext';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import Loading from '../../../components/UI/Loading';

const Blogs: React.FC<BlogsScreenProps> = () => {
  useStatusBarStyle('light-content', 'dark-content');
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
    } finally {
      setRefreshing(false);
    }
  }, []);

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Loading visible={refreshing} inline message="Refreshing blogs" />
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