import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { farmerMarket, market } from '../../../constants/images';
import BlogItem from './BlogItem';
import { Blog } from '../../../models/blog';
import { normalize } from '../../../utils/util';

const blogs: Blog[] = [
  { categoryTitle: 'Weekly 2-Bite Challenge', title: 'Pike Place Farmer’s Market', address: '85 Pike St Seattle, WA 98108', from: '8:00 AM', to: '2:00 PM', image: market },
  { categoryTitle: 'Beet Farms Pop-Up', title: 'Bellevue Farmer’s Market', address: '2741 Blane Rd Bellevue, WA 98175', from: '3:00 PM', to: '7:00 PM', image: farmerMarket },
];

const BlogList = () => {
  return (
    <>
      <Text style={styles.headingTitle}>What's New</Text>
      <FlatList
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={blogs}
        renderItem={({ item }) => (
          <BlogItem item={item}/>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headingTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.MLARGE,
    color: COLORS.black,
    paddingHorizontal: normalize(16),
  },
  listContainer: {
    padding: normalize(16),
  },
  separator: {
    paddingBottom: 10,
  },
});

export default BlogList;