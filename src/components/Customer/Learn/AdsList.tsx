import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {COLORS} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import navigationService from '../../../navigation/navigationService';

interface AdsProps {
  id: number;
  categoryImage: any;
}

const data: AdsProps[] = [
  {
    id: 1,
    categoryImage: require('../../../../assets/images/dump/empowering_small_farmers-996x567.jpg'),
  },
  {
    id: 2,
    categoryImage: require('../../../../assets/images/dump/Regenerative-agriculture-farmer.jpg'),
  },
  {
    id: 3,
    categoryImage: require('../../../../assets/images/dump/Field_Preparation_Kenya-2e16d0ba-fill-2400x1600-c100.jpg'),
  },
  {
    id: 4,
    categoryImage: require('../../../../assets/images/dump/HELLO-FUTURE-ServicesAgricolesAfrique-1198x500.jpg'),
  },
  {
    id: 5,
    categoryImage: require('../../../../assets/images/dump/Sect2_AGRICULTURE-AND-FOOD_HiRes-32.png'),
  },
];

const horizontalPadding = normalize(16);
const carouselWidth = Dimensions.get('window').width - horizontalPadding * 2;

const AdsList = ({}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<FlatList<AdsProps>>(null);

  const cardPressHandler = () => {
    navigationService.navigate('Courses');
  };

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / carouselWidth);
    setActiveIndex(Math.max(0, Math.min(nextIndex, data.length - 1)));
  };

  useEffect(() => {
    if (data.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex(prev => {
        const nextIndex = (prev + 1) % data.length;
        carouselRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={carouselRef}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={carouselWidth}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        data={data}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_item, index) => ({
          length: carouselWidth,
          offset: carouselWidth * index,
          index,
        })}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={cardPressHandler}
            activeOpacity={0.9}>
            <Image source={item.categoryImage} style={styles.image} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        keyExtractor={item => item.id.toString()}
      />

      <View style={styles.paginationContainer}>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: normalize(10),
  },
  imageContainer: {
    width: carouselWidth,
    paddingHorizontal: horizontalPadding,
  },
  image: {
    width: '100%',
    height: normalize(170),
    resizeMode: 'cover',
    borderRadius: normalize(12),
  },
  listContainer: {
    paddingRight: horizontalPadding,
  },
  paginationContainer: {
    marginTop: normalize(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: normalize(6),
  },
  dot: {
    width: normalize(7),
    height: normalize(7),
    borderRadius: normalize(7),
    backgroundColor: '#D7D7D7',
  },
  activeDot: {
    width: normalize(18),
    backgroundColor: COLORS.primary,
  },
});

export default AdsList;
