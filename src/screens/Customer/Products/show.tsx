import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { ProductDetailsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { bottomInsets, normalize } from '../../../utils/util';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { Product } from '../../../models/Product';
import ImageSlider from '../../../components/UI/ImageSlider';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import ProductInfo from '../../../components/Customer/Product/ProductInfo';
import CheckoutButton from '../../../components/Customer/Cart/CheckoutButton';

const images = [
  require('../../../../assets/images/banner.png'),
  require('../../../../assets/images/banner.png'),
  require('../../../../assets/images/banner.png'),
  require('../../../../assets/images/banner.png'),
]

const ProductDetails: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  useStatusBarStyle('light-content', 'dark-content');
  const { product }: { product: Product } = route.params;

  function goToCart() {
    navigation.navigate('Cart')
  }

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none'
      }
    });
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: styles.tabBarStyle
    });
  }, [navigation]);
  

  return (
    <View style={[styles.container, { paddingBottom: bottomInsets(10)}]}>
      <Header goBack={true} title={product.name}/>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        <ImageSlider
          images={images}
          dotColor={COLORS.primary}
          inactiveDotColor={COLORS.lightGrey}
          autoplay
          sliderBoxStyle={styles.sliderWrapper}
        />
        <ProductInfo product={product}/>
      </ScrollView>
      <View style={[styles.row, styles.spacing]}>
        <View style={styles.row}>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.discountedPrice}>{product.discountedPrice}</Text>
        </View>
        <CheckoutButton 
          label="Add to cart" 
          style={styles.addToCart}
          onPress={goToCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingBottom: normalize(120)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacing: {
    backgroundColor: COLORS.transparent,
    marginHorizontal: normalize(16),
  },
  sliderWrapper: {
    paddingHorizontal: 0,
    height: 160,
    marginBottom: Platform.select({
      ios: normalize(20),
      android: normalize(15)
    }),
  },
  card: {
    paddingHorizontal: normalize(16),
  },
  tabBarStyle: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: Platform.select({
      ios: normalize(14),
      android: normalize(4),
    }),
    elevation: 10,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    height: normalize(65),
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
  },
  addToCart: {
    marginTop: 0,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(30),
  },
  price: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.grey,
    textDecorationLine: 'line-through',
    paddingRight: normalize(8),
  },
  discountedPrice: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MLARGE,
    color: COLORS.darkText,
  },
});

export default ProductDetails;