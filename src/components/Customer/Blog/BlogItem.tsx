import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Blog } from '../../../models/blog';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import FastImage from '@d11/react-native-fast-image';
import { normalize } from '../../../utils/util';

interface BlogProps {
  item: Blog;
}

const BlogItem: React.FC<BlogProps> = ({ item }) => {
  
  function more() {
  // 
  }

  return (
    <>
      <View style={[styles.inline, styles.spacing]}>
        <Text style={styles.categoryTitle} numberOfLines={1}>{item.categoryTitle}</Text>
        <Pressable onPress={more}>
          <Text style={[styles.addressText, styles.underline]}>More</Text>
        </Pressable>
      </View>
      <View style={[styles.blogContainer, styles.card]}>
        <Image
          // @ts-ignore
          source={item.image}
          style={styles.blogImage}
          resizeMode={FastImage.resizeMode.contain}
          />
        <View style={styles.blogDetails}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <View style={styles.inline}>
            <Text style={styles.timing}>{item.from}{' - '}</Text>
            <Text style={styles.timing}>{item.to}</Text>
          </View>
          <View style={styles.address}>
            <Text style={[styles.addressText, styles.underline]} numberOfLines={1}>{item.address}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  blogContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginVertical: 8,
  },
  card: {
    borderRadius: 15,
    padding: 13,
    alignItems: 'center',
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacing: {
    paddingBottom: normalize(5),
  },
  blogImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  blogDetails: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'space-around',
  },
  categoryTitle: {
    flex: 1,
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  },
  title: {
    flex: 1,
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
  },
  timing: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    paddingVertical: 5,
  },
  blogPrice: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
  },
  address: {
  },
  addressText: {
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
  },
  underline: {
    textDecorationLine: 'underline',
  }
});

export default BlogItem;