import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  TextInput,
  Share,
  Linking,
} from 'react-native';
import { ProductDetailsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import { bottomInsets, normalize } from '../../../utils/util';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { Product } from '../../../models/Product';
import ImageSlider from '../../../components/UI/ImageSlider';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import ProductInfo from '../../../components/Customer/Product/ProductInfo';
import CheckoutButton from '../../../components/Customer/Cart/CheckoutButton';
import {
  createMarketplaceProductReview,
  getMarketplaceProductDetail,
  getMarketplaceProductReviews,
  getMarketplaceProductsByCategory,
  MarketplaceReview,
} from '../../../api/marketplace.api';
import ErrorText from '../../../components/UI/ErrorText';
import {
  isProductSaved,
  toggleSavedProduct,
  trackRecentProduct,
} from '../../../api/preferences.api';

const images = [
  require('../../../../assets/images/dump/Maximizing-Profits-in-Agriculture-The-Importance-of-Value-Ad.jpg'),
  require('../../../../assets/images/dump/Digital-Agriculture-Africa-sdf-copyright-FSPN-Africa.jpg'),
  require('../../../../assets/images/dump/Agricultural-Technology-in-Africa-1.jpg'),
]

const ProductDetails: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  useStatusBarStyle('light-content', 'dark-content');
  const { product }: { product: Product } = route.params;
  const [productDetail, setProductDetail] = useState<Product>(product);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const sliderImages = useMemo(() => {
    if (images.length > 0) {
      return images;
    }

    return [productDetail.image];
  }, [images, productDetail]);

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

  useEffect(() => {
    let mounted = true;

    const loadProductDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const [result, reviewList, savedState] = await Promise.all([
          getMarketplaceProductDetail(product.id),
          getMarketplaceProductReviews(product.id).catch(() => []),
          isProductSaved(product.id).catch(() => false),
        ]);

        if (mounted) {
          setProductDetail(result.product);
          setImages(result.images);
          setReviews(reviewList);
          setSaved(savedState);

          trackRecentProduct({
            type: 'product',
            id: String(result.product.id),
            title: result.product.name,
            subtitle: result.product.price,
            image: result.product.imageUrl,
            link: `/marketplace/${result.product.id}`,
          }).catch(() => undefined);

          if (result.product.categoryId) {
            setRelatedLoading(true);
            getMarketplaceProductsByCategory(result.product.categoryId)
              .then(list => {
                if (!mounted) {
                  return;
                }
                const related = list
                  .filter(item => String(item.id) !== String(result.product.id))
                  .slice(0, 4);
                setRelatedProducts(related);
              })
              .catch(() => {
                if (mounted) {
                  setRelatedProducts([]);
                }
              })
              .finally(() => {
                if (mounted) {
                  setRelatedLoading(false);
                }
              });
          } else {
            setRelatedProducts([]);
          }
        }
      } catch (_error) {
        if (mounted) {
          setError('Unable to load product details right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProductDetail();

    return () => {
      mounted = false;
    };
  }, [product.id]);

  const onShareProduct = async () => {
    await Share.share({
      message: `Check this product: ${productDetail.name}`,
      title: productDetail.name,
    });
  };

  const onCallSeller = async () => {
    const digits = String(productDetail.sellerPhone || '').replace(/\D/g, '');
    if (!digits) {
      setError('Seller contact is not available.');
      return;
    }

    await Linking.openURL(`tel:${digits}`);
  };

  const onWhatsappSeller = async () => {
    const digits = String(productDetail.sellerPhone || '').replace(/\D/g, '');
    if (!digits) {
      setError('Seller contact is not available.');
      return;
    }

    await Linking.openURL(`https://wa.me/${digits}`);
  };

  const onToggleSaved = async () => {
    const nextState = await toggleSavedProduct({
      type: 'product',
      id: String(productDetail.id),
      title: productDetail.name,
      subtitle: productDetail.price,
      image: productDetail.imageUrl,
      link: `/marketplace/${productDetail.id}`,
    });

    setSaved(nextState);
  };

  const onSubmitReview = async () => {
    try {
      setSubmittingReview(true);
      await createMarketplaceProductReview(productDetail.id, {
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      });

      setReviewLoading(true);
      const [nextReviews, detail] = await Promise.all([
        getMarketplaceProductReviews(productDetail.id).catch(() => []),
        getMarketplaceProductDetail(productDetail.id),
      ]);
      setReviews(nextReviews);
      setProductDetail(detail.product);
      setReviewComment('');
    } catch (reviewError) {
      setError('Unable to submit review right now.');
    } finally {
      setSubmittingReview(false);
      setReviewLoading(false);
    }
  };
  

  return (
    <View style={[styles.container, { paddingBottom: bottomInsets(10)}]}>
      <Header goBack={true} title="Product Details" icons={false} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        >
        {loading && <ActivityIndicator style={styles.loader} color={COLORS.primary} />}
        {!!error && <ErrorText text={error} />}
        <ImageSlider
          images={sliderImages}
          dotColor={COLORS.primary}
          inactiveDotColor={COLORS.lightGrey}
          autoplay
          sliderBoxStyle={styles.sliderWrapper}
        />
        <ProductInfo product={productDetail}/>

        <View style={styles.actionRow}>
          <TouchableOpacity testID="product-save" onPress={onToggleSaved} style={styles.actionButtonPrimary}>
            <Text style={styles.actionPrimaryText}>{saved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="product-share" onPress={onShareProduct} style={styles.actionButtonSecondary}>
            <Text style={styles.actionSecondaryText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="product-call" onPress={onCallSeller} style={styles.actionButtonSecondary}>
            <Text style={styles.actionSecondaryText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="product-whatsapp" onPress={onWhatsappSeller} style={styles.actionButtonSecondary}>
            <Text style={styles.actionSecondaryText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
          <View style={styles.ratingRow}>
            {[5, 4, 3, 2, 1].map(star => (
              <TouchableOpacity
                testID={`review-rating-${star}`}
                key={star}
                onPress={() => setReviewRating(star)}
                style={[styles.ratingChip, reviewRating === star && styles.ratingChipActive]}>
                <Text
                  style={[
                    styles.ratingChipText,
                    reviewRating === star && styles.ratingChipTextActive,
                  ]}>
                  {star}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            testID="review-comment-input"
            style={styles.reviewInput}
            value={reviewComment}
            onChangeText={setReviewComment}
            placeholder="Write a short review (optional)"
            multiline
          />
          <Pressable
            testID="review-submit"
            style={styles.submitReviewButton}
            onPress={onSubmitReview}
            disabled={submittingReview}>
            <Text style={styles.submitReviewText}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Text>
          </Pressable>
          {reviewLoading ? <ActivityIndicator color={COLORS.primary} style={styles.reviewLoader} /> : null}
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>No reviews yet.</Text>
          ) : (
            reviews.slice(0, 5).map(item => (
              <View key={String(item.id)} style={styles.reviewCard}>
                <Text style={styles.reviewMeta}>
                  {item.reviewer?.name || 'User'} - {item.rating}/5
                </Text>
                <Text style={styles.reviewComment}>{item.comment || 'No comment'}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Related Products</Text>
          {relatedLoading ? (
            <ActivityIndicator color={COLORS.primary} style={styles.reviewLoader} />
          ) : relatedProducts.length === 0 ? (
            <Text style={styles.emptyText}>No related products found.</Text>
          ) : (
            relatedProducts.map(item => (
              <TouchableOpacity
                key={String(item.id)}
                testID={`related-product-${item.id}`}
                style={styles.relatedItem}
                onPress={() => navigation.push('ProductDetails', {product: item})}>
                <Text style={styles.relatedTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.relatedMeta} numberOfLines={1}>{item.category} - {item.price}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <View style={[styles.row, styles.purchaseBar]}>
        <View>
          <Text style={styles.priceLabel}>Offer Price</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{productDetail.price}</Text>
            <Text style={styles.discountedPrice}>{productDetail.discountedPrice}</Text>
          </View>
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
  loader: {
    paddingTop: normalize(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    marginTop: normalize(14),
    marginHorizontal: normalize(16),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
  },
  actionButtonPrimary: {
    borderRadius: normalize(20),
    backgroundColor: COLORS.primary,
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(8),
  },
  actionPrimaryText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
  actionButtonSecondary: {
    borderRadius: normalize(20),
    borderWidth: 1,
    borderColor: '#D7DDE8',
    backgroundColor: COLORS.white,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
  },
  actionSecondaryText: {
    color: '#566077',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  sectionCard: {
    marginTop: normalize(14),
    marginHorizontal: normalize(16),
    borderWidth: 1,
    borderColor: '#ECEFF4',
    borderRadius: normalize(12),
    padding: normalize(12),
    backgroundColor: '#FBFCFE',
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.darkText,
    marginBottom: normalize(10),
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: normalize(8),
  },
  ratingChip: {
    borderWidth: 1,
    borderColor: '#D6DCE7',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(5),
    marginRight: normalize(6),
  },
  ratingChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EAF5ED',
  },
  ratingChipText: {
    color: '#5F6775',
    fontSize: FONT_SIZES.XSMALL,
  },
  ratingChipTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#DCE1EA',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    minHeight: normalize(62),
    textAlignVertical: 'top',
    color: COLORS.darkText,
  },
  submitReviewButton: {
    marginTop: normalize(10),
    alignSelf: 'flex-start',
    borderRadius: normalize(18),
    backgroundColor: COLORS.primary,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
  },
  submitReviewText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.XSMALL,
  },
  reviewLoader: {
    marginTop: normalize(8),
  },
  emptyText: {
    color: '#7D8798',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  reviewCard: {
    marginTop: normalize(8),
    borderWidth: 1,
    borderColor: '#E6EAF1',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(8),
    backgroundColor: COLORS.white,
  },
  reviewMeta: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    marginBottom: normalize(2),
  },
  reviewComment: {
    color: '#6A7385',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  relatedItem: {
    borderWidth: 1,
    borderColor: '#E6EAF1',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(9),
    marginBottom: normalize(8),
    backgroundColor: COLORS.white,
  },
  relatedTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    marginBottom: normalize(2),
  },
  relatedMeta: {
    color: '#6A7385',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  purchaseBar: {
    justifyContent: 'space-between',
    marginHorizontal: normalize(16),
    marginBottom: normalize(6),
    borderRadius: normalize(18),
    borderWidth: 1,
    borderColor: '#ECEFF4',
    backgroundColor: COLORS.white,
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(10),
    elevation: 6,
    shadowColor: '#202739',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 10,
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
    paddingHorizontal: normalize(18),
    borderRadius: normalize(30),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.grey,
    textDecorationLine: 'line-through',
    paddingRight: normalize(8),
  },
  priceLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    color: COLORS.grey,
    marginBottom: normalize(2),
  },
  discountedPrice: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MLARGE,
    color: COLORS.darkText,
  },
});

export default ProductDetails;