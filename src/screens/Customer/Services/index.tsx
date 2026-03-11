import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Text,
} from 'react-native';
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
import Filters from '../../../components/UI/Filters';
import {getServiceCategories, getServiceListings} from '../../../api/services.api';

const PAGE_SIZE = 6;

const Services: React.FC<ServicesScreenProps> = ({navigation}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {registerScrollRef} = useScrollContext();
  const [services, setServices] = useState<Product[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>(['All']);
  const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    registerScrollRef('Services', scrollViewRef as React.RefObject<ScrollView>);
  }, [registerScrollRef]);

  useEffect(() => {
    let mounted = true;

    const loadServices = async () => {
      try {
        setLoading(true);
        setError('');
        const [serviceCategories, listings] = await Promise.all([
          getServiceCategories().catch(() => []),
          getServiceListings(),
        ]);

        if (mounted) {
          setServices(listings);

          const nextCategoryMap: Record<string, number> = {};
          serviceCategories.forEach(item => {
            if (item?.name && item?.id) {
              nextCategoryMap[item.name] = item.id;
            }
          });

          setCategoryMap(nextCategoryMap);
          setCategoryOptions(['All', ...Object.keys(nextCategoryMap)]);
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

  const visibleServices = useMemo(() => {
    const searchKey = String(search || '').trim().toLowerCase();
    return services
      .filter(item => {
        if (activeCategory === 'All') {
          return true;
        }
        const selectedId = categoryMap[activeCategory];
        return Number(item.categoryId || 0) === Number(selectedId || 0);
      })
      .filter(item => {
        if (!searchKey) {
          return true;
        }

        return [
          item.name,
          item.shortDescription,
          item.description,
          item.sellerName,
          item.serviceArea,
          item.category,
        ]
          .join(' ')
          .toLowerCase()
          .includes(searchKey);
      });
  }, [activeCategory, categoryMap, search, services]);

  const pagedServices = useMemo(() => {
    return visibleServices.slice(0, visibleCount);
  }, [visibleServices, visibleCount]);

  const hasMore = visibleServices.length > visibleCount;

  const showService = (product: Product) => {
    navigation.navigate('ServiceDetails', {product});
  };

  const resetFilters = () => {
    setActiveCategory('All');
    setSearch('');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <View style={styles.container}>
      <Header goBack title="Services" />
      <AnimatedHeaderScrollView
        ref={scrollViewRef}
        headerHeight={normalize(50)}
        headerContent={
          <SearchBar
            hasFilter
            placeholder="Search services or providers"
            value={search}
            onChangeText={setSearch}
          />
        }>
        <View style={styles.linkRow}>
          <Pressable onPress={() => navigation.navigate('MyServiceRequests')}>
            <Text style={styles.linkText}>My Requests</Text>
          </Pressable>
        </View>
        <Filters
          options={categoryOptions}
          activeFilter={activeCategory}
          onFilterChange={filter => {
            setActiveCategory(filter);
            setVisibleCount(PAGE_SIZE);
          }}
          itemStyle={styles.filterItem}
        />
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionButton} onPress={resetFilters}>
            <Text style={styles.actionText}>Reset</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, !hasMore && styles.actionButtonDisabled]}
            disabled={!hasMore}
            onPress={() => setVisibleCount(current => current + PAGE_SIZE)}>
            <Text style={styles.actionText}>More</Text>
          </Pressable>
        </View>
        {loading ? (
          <ActivityIndicator style={styles.loader} color={COLORS.primary} />
        ) : pagedServices.length === 0 ? (
          <ErrorText text="No services available for the selected filters." />
        ) : (
          <ProductList productLists={pagedServices} onPress={showService} />
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
  actionsRow: {
    flexDirection: 'row',
    gap: normalize(10),
    paddingHorizontal: normalize(16),
    paddingTop: normalize(6),
  },
  actionButton: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: normalize(20),
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(14),
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
  filterItem: {
    width: normalize(110),
  },
  linkText: {
    color: COLORS.darkText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    textDecorationLine: 'underline',
  },
});

export default Services;
