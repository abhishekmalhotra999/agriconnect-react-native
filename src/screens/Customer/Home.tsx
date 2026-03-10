import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Platform, StatusBar } from 'react-native';
import { HomeScreenProps } from '../../navigation/types';
import Header from '../../containers/header';
import ProductGrid from '../../components/Customer/Product/ProductGrid';
import CategoryList from '../../components/Customer/Category/CategoryList';
import ImageSlider from '../../components/UI/ImageSlider';
import SearchBar from '../../components/UI/SearchBar';
import AnimatedHeaderScrollView from '../../components/UI/AnimatedScrollView';
import { useScrollContext } from '../../contexts/ScrollContext';
import { normalize } from '../../utils/util';
import { COLORS } from '../../themes/styles';
import { Product } from '../../models/Product';
import useStatusBarStyle from '../../hooks/useStatusBarStyle';

const images = [
  require('../../../assets/images/banner.png'),
  require('../../../assets/images/banner.png'),
  require('../../../assets/images/banner.png'),
  require('../../../assets/images/banner.png'),
]

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  useStatusBarStyle('light-content', 'dark-content');
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();

  useEffect(() => {
    registerScrollRef('HOME_TAB', scrollViewRef);
  }, [registerScrollRef]);

  return (
    <View style={styles.container}>
    <Header />
    <AnimatedHeaderScrollView
      ref={scrollViewRef}
      headerHeight={normalize(65)}
      showsVerticalScrollIndicator={false}
      headerContent={(
        <>
        <SearchBar hasFilter={true} placeholder="Search.." />
        </>
      )}
      >
        <ImageSlider
          images={images}
          dotColor={COLORS.primary}
          inactiveDotColor={COLORS.lightGrey}
          autoplay
          sliderBoxStyle={styles.sliderWrapper}
        />
        <CategoryList />
        <ProductGrid />
      </AnimatedHeaderScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sliderWrapper: {
    height: 160,
    marginBottom: Platform.select({
      ios: normalize(20),
      android: normalize(15)
    }),
  }
});

export default Home;
