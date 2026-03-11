import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View, Pressable, Text} from 'react-native';
import Header from '../../../containers/header';
import {ServicesScreenProps} from '../../../navigation/types';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import SearchBar from '../../../components/UI/SearchBar';
import {normalize} from '../../../utils/util';
import {useScrollContext} from '../../../contexts/ScrollContext';
import {COLORS, FONTS, FONT_SIZES} from '../../../themes/styles';
import ProductList from '../../../components/Customer/Product/ProductList';
import {Product} from '../../../models/Product';
import ErrorText from '../../../components/UI/ErrorText';
import {
  getServiceListings,
} from '../../../api/services.api';

const Services: React.FC<ServicesScreenProps> = ({navigation}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {registerScrollRef} = useScrollContext();
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    registerScrollRef('Services', scrollViewRef);
  }, [registerScrollRef]);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getServiceListings();
        if (mounted) {
          setServices(result);
        }
      } catch (_error) {
        if (mounted) {
          setError('Unable to load services right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  const showService = (product: Product) => {
    navigation.navigate('ServiceDetails', {product});
  };

  return (
    <View style={styles.container}>
      <Header goBack title="Services" />
      <AnimatedHeaderScrollView
        ref={scrollViewRef}
        headerHeight={normalize(50)}
        headerContent={<SearchBar hasFilter placeholder="Search services.." />}>
        <View style={styles.linkRow}>
          <Pressable onPress={() => navigation.navigate('MyServiceRequests')}>
            <Text style={styles.linkText}>My Requests</Text>
          </Pressable>
        </View>
        {loading ? (
          <ActivityIndicator style={styles.loader} color={COLORS.primary} />
        ) : (
          <ProductList productLists={services} onPress={showService} />
        )}
        {!!error && <ErrorText text={error} />}
      </AnimatedHeaderScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loader: {
    paddingTop: normalize(20),
  },
  linkRow: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(10),
  },
  linkText: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    textDecorationLine: 'underline',
  },
});

export default Services;
