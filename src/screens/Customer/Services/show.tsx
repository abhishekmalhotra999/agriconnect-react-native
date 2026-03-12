import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../../containers/header';
import {ServiceDetailsScreenProps} from '../../../navigation/types';
import {bottomInsets, normalize} from '../../../utils/util';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import {Product} from '../../../models/Product';
import ImageSlider from '../../../components/UI/ImageSlider';
import ProductInfo from '../../../components/Customer/Product/ProductInfo';
import CheckoutButton from '../../../components/Customer/Cart/CheckoutButton';
import ErrorText from '../../../components/UI/ErrorText';
import {
  createServiceListingReview,
  createServiceRequest,
  getServiceListingDetail,
  getServiceListingReviews,
  getServiceListingsByCategory,
} from '../../../api/services.api';
import {userContext} from '../../../contexts/UserContext';
import {
  isPreferenceSaved,
  toggleSavedPreference,
  trackRecentPreference,
} from '../../../api/preferences.api';

const ServiceDetails: React.FC<ServiceDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const {product}: {product: Product} = route.params;
  const {user} = userContext();
  const [serviceDetail, setServiceDetail] = useState<Product>(product);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterPhone, setRequesterPhone] = useState(user?.phone || '');
  const [requesterEmail, setRequesterEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [success, setSuccess] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [relatedServices, setRelatedServices] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const sliderImages = useMemo(() => {
    if (images.length > 0) {
      return images;
    }

    return [serviceDetail.image];
  }, [images, serviceDetail]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: styles.tabBarStyle,
      });
  }, [navigation]);

  useEffect(() => {
    let mounted = true;

    const loadServiceDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const [result, reviewList, savedState] = await Promise.all([
          getServiceListingDetail(product.id),
          getServiceListingReviews(product.id).catch(() => []),
          isPreferenceSaved('service', product.id).catch(() => false),
        ]);

        if (mounted) {
          setServiceDetail(result.product);
          setImages(result.images);
          setReviews(reviewList);
          setSaved(savedState);

          trackRecentPreference('service', {
            type: 'service',
            id: String(result.product.id),
            title: result.product.name,
            subtitle: result.product.serviceArea || '',
            image: result.product.imageUrl,
            link: `/services/${result.product.id}`,
          }).catch(() => undefined);

          if (result.product.categoryId) {
            setRelatedLoading(true);
            getServiceListingsByCategory(Number(result.product.categoryId))
              .then(list => {
                if (!mounted) {
                  return;
                }
                const nextRelated = list
                  .filter(item => String(item.id) !== String(result.product.id))
                  .slice(0, 4);
                setRelatedServices(nextRelated);
              })
              .catch(() => {
                if (mounted) {
                  setRelatedServices([]);
                }
              })
              .finally(() => {
                if (mounted) {
                  setRelatedLoading(false);
                }
              });
          } else {
            setRelatedServices([]);
          }
        }
      } catch (_error) {
        if (mounted) {
          setError('Unable to load service details right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadServiceDetail();

    return () => {
      mounted = false;
    };
  }, [product.id]);

  const requestService = async () => {
    if (requesting || !serviceDetail.inStock) {
      return;
    }

    if (!requesterName.trim() || !requesterPhone.trim()) {
      setError('Name and phone are required.');
      return;
    }

    if (!message.trim()) {
      setError('Please add a short message for the technician.');
      return;
    }

    try {
      setRequesting(true);
      setError('');
      setSuccess('');

      await createServiceRequest({
        serviceListingId: serviceDetail.id,
        requesterName: requesterName.trim(),
        requesterPhone: requesterPhone.trim(),
        requesterEmail: requesterEmail.trim(),
        message: message.trim(),
      });

      setMessage('');
      setSuccess('Service request submitted successfully.');
    } catch (requestError: any) {
      setError(requestError?.message || 'Unable to send your request.');
    } finally {
      setRequesting(false);
    }
  };

  const onToggleSaved = async () => {
    const nextState = await toggleSavedPreference('service', {
      type: 'service',
      id: String(serviceDetail.id),
      title: serviceDetail.name,
      subtitle: serviceDetail.serviceArea || '',
      image: serviceDetail.imageUrl,
      link: `/services/${serviceDetail.id}`,
    });

    setSaved(nextState);
  };

  const onShareService = async () => {
    await Share.share({
      message: `Check this service: ${serviceDetail.name}`,
      title: serviceDetail.name,
    });
  };

  const onCallTechnician = async () => {
    const digits = String(serviceDetail.sellerPhone || '').replace(/\D/g, '');
    if (!digits) {
      setError('Technician contact is not available.');
      return;
    }

    await Linking.openURL(`tel:${digits}`);
  };

  const onWhatsappTechnician = async () => {
    const digits = String(serviceDetail.sellerPhone || '').replace(/\D/g, '');
    if (!digits) {
      setError('Technician contact is not available.');
      return;
    }

    await Linking.openURL(`https://wa.me/${digits}`);
  };

  const onSubmitReview = async () => {
    try {
      setSubmittingReview(true);
      setError('');

      await createServiceListingReview(serviceDetail.id, {
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      });

      setReviewLoading(true);
      const [nextReviews, detail] = await Promise.all([
        getServiceListingReviews(serviceDetail.id).catch(() => []),
        getServiceListingDetail(serviceDetail.id),
      ]);
      setReviews(nextReviews);
      setServiceDetail(detail.product);
      setReviewComment('');
    } catch {
      setError('Unable to submit review right now.');
    } finally {
      setSubmittingReview(false);
      setReviewLoading(false);
    }
  };

  return (
    <View style={[styles.container, {paddingBottom: bottomInsets(10)}]}>
      <Header
        goBack={true}
        title="Service Details"
        icons={false}
        showButtons={false}
        otherTextStyle={{}}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {loading && <ActivityIndicator style={styles.loader} color={COLORS.primary} />}
        {!!error && <ErrorText text={error} />}
        {!!success && <Text style={styles.success}>{success}</Text>}
        <ImageSlider
          images={sliderImages}
          dotColor={COLORS.primary}
          inactiveDotColor={COLORS.lightGrey}
          autoplay
          sliderBoxStyle={styles.sliderWrapper}
        />
        <ProductInfo product={serviceDetail} />

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onToggleSaved} style={styles.actionButtonPrimary}>
            <Text style={styles.actionPrimaryText}>{saved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShareService} style={styles.actionButtonSecondary}>
            <Text style={styles.actionSecondaryText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCallTechnician} style={styles.actionButtonSecondary}>
            <Text style={styles.actionSecondaryText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onWhatsappTechnician} style={styles.actionButtonSecondary}>
            <Text style={styles.actionSecondaryText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Request This Service</Text>
          <TextInput
            style={styles.textInput}
            value={requesterName}
            onChangeText={setRequesterName}
            placeholder="Your name"
          />
          <TextInput
            style={styles.textInput}
            value={requesterPhone}
            onChangeText={setRequesterPhone}
            placeholder="Your phone"
          />
          <TextInput
            style={styles.textInput}
            value={requesterEmail}
            onChangeText={setRequesterEmail}
            placeholder="Your email (optional)"
          />
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your service need"
            multiline
          />
          <Text style={styles.noteText}>
            Share your requirements and preferred timing. The provider will respond in My Requests.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
          <View style={styles.ratingRow}>
            {[5, 4, 3, 2, 1].map(star => (
              <TouchableOpacity
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
            style={[styles.textInput, styles.textArea]}
            value={reviewComment}
            onChangeText={setReviewComment}
            placeholder="Write a short review (optional)"
            multiline
          />
          <Pressable
            style={styles.submitReviewButton}
            onPress={onSubmitReview}
            disabled={submittingReview}>
            <Text style={styles.submitReviewText}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Text>
          </Pressable>
          {reviewLoading ? <ActivityIndicator color={COLORS.primary} style={styles.reviewLoader} /> : null}
          {reviews.length === 0 ? (
            <Text style={styles.noteText}>No reviews yet.</Text>
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
          <Text style={styles.sectionTitle}>Related Services</Text>
          {relatedLoading ? (
            <ActivityIndicator color={COLORS.primary} style={styles.reviewLoader} />
          ) : relatedServices.length === 0 ? (
            <Text style={styles.noteText}>No related services found.</Text>
          ) : (
            relatedServices.map(item => (
              <TouchableOpacity
                key={String(item.id)}
                style={styles.relatedItem}
                onPress={() => navigation.push('ServiceDetails', {product: item})}>
                <Text style={styles.relatedTitle}>{item.name}</Text>
                <Text style={styles.relatedMeta}>
                  {item.serviceArea || 'Area not specified'} - {item.sellerName || 'Unknown'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <View style={[styles.row, styles.spacing]}>
        <CheckoutButton
          label={requesting ? 'Submitting...' : 'Send Request'}
          style={styles.requestButton}
          onPress={requestService}
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
    paddingBottom: normalize(120),
  },
  loader: {
    paddingTop: normalize(10),
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
      android: normalize(15),
    }),
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
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    height: normalize(65),
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
  },
  requestButton: {
    marginTop: 0,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(30),
    width: '100%',
  },
  formCard: {
    paddingHorizontal: normalize(16),
    marginTop: normalize(6),
  },
  actionRow: {
    marginHorizontal: normalize(16),
    marginTop: normalize(8),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
  },
  actionButtonPrimary: {
    borderRadius: normalize(16),
    backgroundColor: COLORS.primary,
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(6),
  },
  actionPrimaryText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  actionButtonSecondary: {
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(6),
  },
  actionSecondaryText: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  sectionCard: {
    marginTop: normalize(12),
    marginHorizontal: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(12),
    padding: normalize(12),
  },
  sectionTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    marginBottom: normalize(10),
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    color: COLORS.darkText,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
    marginBottom: normalize(8),
  },
  textArea: {
    minHeight: normalize(80),
    textAlignVertical: 'top',
  },
  noteText: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.SMALL,
  },
  ratingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
    marginBottom: normalize(8),
  },
  ratingChip: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(14),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
  },
  ratingChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ratingChipText: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  ratingChipTextActive: {
    color: COLORS.white,
  },
  submitReviewButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderRadius: normalize(18),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(7),
    marginBottom: normalize(8),
  },
  submitReviewText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  reviewLoader: {
    marginVertical: normalize(8),
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(10),
    padding: normalize(8),
    marginBottom: normalize(8),
  },
  reviewMeta: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
    marginBottom: normalize(2),
  },
  reviewComment: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
  },
  relatedItem: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(10),
    padding: normalize(8),
    marginBottom: normalize(8),
  },
  relatedTitle: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
  },
  relatedMeta: {
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    marginTop: normalize(2),
  },
  success: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    marginHorizontal: normalize(16),
    marginTop: normalize(8),
  },
});

export default ServiceDetails;
