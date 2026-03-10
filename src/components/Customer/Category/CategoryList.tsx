import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { useProductCategories } from '../../../contexts/ProductCategoriesContext';
import NavigationService from '../../../navigation/navigationService';
import FastImage from '@d11/react-native-fast-image';
import { normalize } from '../../../utils/util';
import { Category } from '../../../models/category';

const categories = [
  { id: 1, name: 'Fruits', image: require('../../../../assets/images/categories/fruits.png') },
  { id: 2, name: 'Grains', image: require('../../../../assets/images/categories/grains.png') },
  { id: 3, name: 'Herbs', image: require('../../../../assets/images/categories/herbs.png') },
];

const CategoryList = () => {
  // const { productCategories } = useProductCategories();
  function viewList() {
    // NavigationService.navigate('Categories');
  }

  function showProducts(category: Category) {
    // NavigationService.navigate('Products', { category })
  }
  
  return (
    <View>
      <View style={[styles.inline, styles.spacing]}>
        <Text style={styles.title}>Categories</Text>
        <Pressable onPress={viewList}>
          <Text style={styles.moreText}>More</Text>
        </Pressable>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => showProducts(item)} style={styles.categoryButton}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image}/>
            </View>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.heading,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: normalize(121),
    height: normalize(56),
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  categoryText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    color: COLORS.heading,
  },
  imageContainer: {
    flex: 1
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  categoryTextContainer: {
    flex: 1
  },
  listContainer: {
    marginLeft: 15,
    paddingRight: 50
  },
  separator: {
    marginRight: 8
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacing: {
    marginTop: normalize(20),
    marginBottom: normalize(10),
    paddingHorizontal: normalize(16),
  },
  moreText: {
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    textDecorationLine: 'underline',
  },
});

export default CategoryList;
