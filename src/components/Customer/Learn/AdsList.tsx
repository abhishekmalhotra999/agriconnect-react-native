import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';
import navigationService from '../../../navigation/navigationService';
import {useAppSelector} from '../../../store/storage';

interface AdsProps {
  id: number;
  categoryImage: any;
}

const data: AdsProps[] = [
  {
    id: 1,
    categoryImage: require('../../../../assets/images/dump/empowering_small_farmers-996x567.jpg'),
  },
  // {id: 2, categoryImage: adsImage},
];

const AdsList = ({}) => {
  // const {courses} = useAppSelector(state => state.learn)
  const cardPressHandler = () => {
    navigationService.navigate('Courses');
    // navigation('Courses');
  };
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={cardPressHandler}>
          <Image source={item.categoryImage} style={styles.image} />
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContainer}
      keyExtractor={item => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.heading,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: 121,
    // height: 56,
    borderRadius: 12,
    // paddingHorizontal: 5,
    paddingVertical: 8,
  },
  categoryText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.heading,
  },
  imageContainer: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  image: {
    width: 263,
    height: 154,
    resizeMode: 'cover',
    borderRadius: normalize(12),
    // backgroundColor: 'black',
  },
  categoryTextContainer: {
    flex: 1,
  },
  listContainer: {
    paddingTop: normalize(10),
    paddingRight: normalize(50),
    paddingLeft: normalize(16),
    // backgroundColor: 'blue',
    // width: '100%',
    justifyContent: 'center',
  },
  separator: {
    // marginRight: 8, //commenting this seperator because we have only 1 tile for now
  },
});

export default AdsList;
