import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
  createServiceRequest,
  getServiceListingDetail,
} from '../../../api/services.api';
import Input from '../../../components/UI/Input';
import {userContext} from '../../../contexts/UserContext';

const ServiceDetails: React.FC<ServiceDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const {product}: {product: Product} = route.params;
  const {user} = userContext();
  const [serviceDetail, setServiceDetail] = useState<Product>(product);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState<any[]>([]);
  const [message, setMessage] = useState('Need support for my farm setup.');
  const [requesting, setRequesting] = useState(false);
  const [success, setSuccess] = useState('');

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
        const result = await getServiceListingDetail(product.id);
        if (mounted) {
          setServiceDetail(result.product);
          setImages(result.images);
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
        requesterName: user?.name || 'Customer',
        requesterPhone: user?.phone || '',
        requesterEmail: user?.email || '',
        message: message.trim(),
      });

      setSuccess('Request sent successfully.');
    } catch (requestError: any) {
      setError(requestError?.message || 'Unable to send your request.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <View style={[styles.container, {paddingBottom: bottomInsets(10)}]}>
      <Header goBack title={serviceDetail.name} />
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
        <View style={styles.formCard}>
          <Input
            placeholder="Tell the technician what help you need"
            value={message}
            onChangeText={setMessage}
          />
        </View>
      </ScrollView>
      <View style={[styles.row, styles.spacing]}>
        <CheckoutButton
          label={requesting ? 'Sending...' : 'Request Service'}
          style={styles.requestButton}
          onPress={requestService}
          disabled={requesting}
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
  success: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    marginHorizontal: normalize(16),
    marginTop: normalize(8),
  },
});

export default ServiceDetails;
