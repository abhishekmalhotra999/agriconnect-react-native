import React from 'react';
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Product} from '../../../models/Product';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {normalize} from '../../../utils/util';

type ProductItemProps = {
  item: Product;
  onPress: (product: Product) => void;
  variant?: 'default' | 'service';
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
};

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  onPress,
  variant = 'default',
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const rating = Number(item.rating || 0).toFixed(1);
  const isServiceCard = variant === 'service';

  const onWishlistPress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onToggleWishlist?.(item);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => onPress(item)}
      style={[styles.card, isServiceCard && styles.serviceCard]}>
      <View style={[styles.imageShell, isServiceCard && styles.serviceImageShell]}>
        <Image source={item.image as any} style={styles.productImage} resizeMode="cover" />
        <Pressable
          onPress={onWishlistPress}
          style={[styles.wishlistCircle, isWishlisted && styles.wishlistCircleActive]}>
          <Image
            source={
              isWishlisted
                ? require('../../../../assets/icons/heart_highlighted.png')
                : require('../../../../assets/icons/heart.png')
            }
            style={[styles.wishlistIcon, isWishlisted && styles.wishlistIconActive]}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.categoryBadge} numberOfLines={1}>
            {isServiceCard ? 'Service' : item.category || 'General'}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {isServiceCard
            ? item.shortDescription || item.serviceArea || 'Area and scope available on details'
            : item.shortDescription || item.description || 'No description available'}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.originalPrice} numberOfLines={1}>
            {item.price}
          </Text>
          <Text style={styles.salePrice} numberOfLines={1}>
            {item.discountedPrice}
          </Text>
        </View>

        {isServiceCard ? (
          <Text style={styles.offerText}>Starting price</Text>
        ) : (
          <View style={styles.rowBetween}>
            <Text style={styles.offerText}>Offer price</Text>
            <View style={styles.stockPill}>
              <Text style={styles.stockText}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Text>
            </View>
          </View>
        )}

        <View style={styles.badgesRow}>
          <Text style={[styles.metaBadge, styles.successBadge]} numberOfLines={1}>
            {isServiceCard ? item.serviceArea || 'Verified seller' : 'Verified seller'}
          </Text>
          <Text style={[styles.metaBadge, styles.neutralBadge]}>
            <Image
              source={require('../../../../assets/icons/star.png')}
              style={styles.starIcon}
              resizeMode="contain"
            />{' '}
            {rating} ({item.ratingCount || 0})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    backgroundColor: COLORS.white,
    borderRadius: normalize(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    elevation: 5,
    shadowColor: '#1D2230',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  serviceCard: {
    borderColor: '#E6EAF2',
    shadowColor: '#121826',
    shadowOpacity: 0.11,
    shadowRadius: 14,
    elevation: 6,
  },
  imageShell: {
    margin: normalize(8),
    borderRadius: normalize(16),
    overflow: 'hidden',
    borderWidth: 0.4,
    borderColor: '#D4DAE5',
    backgroundColor: '#F6F8FC',
  },
  serviceImageShell: {
    borderColor: '#CED7E6',
    backgroundColor: '#EEF4FF',
  },
  productImage: {
    width: '100%',
    height: normalize(126),
    backgroundColor: '#F8F9FB',
  },
  wishlistCircle: {
    position: 'absolute',
    right: normalize(10),
    top: normalize(10),
    width: normalize(34),
    height: normalize(34),
    borderRadius: normalize(17),
    borderWidth: 1,
    borderColor: '#DCE3EE',
    backgroundColor: 'rgba(255,255,255,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#111827',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
  },
  wishlistCircleActive: {
    borderColor: '#F7C9D0',
    backgroundColor: '#FFF4F6',
  },
  wishlistIcon: {
    width: normalize(16),
    height: normalize(16),
    tintColor: '#848EA0',
  },
  wishlistIconActive: {
    tintColor: '#EA4C62',
  },
  content: {
    paddingHorizontal: normalize(11),
    paddingBottom: normalize(10),
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
    marginRight: normalize(6),
  },
  categoryBadge: {
    maxWidth: normalize(74),
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
    backgroundColor: '#F5F6FA',
    color: '#616A7D',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    textAlign: 'center',
  },
  description: {
    marginTop: normalize(4),
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    lineHeight: normalize(15),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(8),
    marginBottom: normalize(6),
  },
  originalPrice: {
    color: '#8A8F9D',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    textDecorationLine: 'line-through',
    marginRight: normalize(6),
  },
  salePrice: {
    color: COLORS.darkText,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.SMALL,
  },
  offerText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  stockPill: {
    paddingHorizontal: normalize(7),
    paddingVertical: normalize(2),
    borderRadius: normalize(10),
    backgroundColor: COLORS.primaryLight,
  },
  stockText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: normalize(7),
    gap: normalize(6),
  },
  metaBadge: {
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(8),
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    overflow: 'hidden',
  },
  successBadge: {
    color: '#1B8B5A',
    backgroundColor: '#E9F7F0',
  },
  neutralBadge: {
    color: '#5D6473',
    backgroundColor: '#F1F3F7',
  },
  starIcon: {
    width: normalize(11),
    height: normalize(11),
  },
});

export default ProductItem;
