import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
import {
  getUserPreferences,
  toggleSavedPreference,
} from '../../../api/preferences.api';

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
  const [savedServiceMap, setSavedServiceMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    registerScrollRef('Services', scrollViewRef as React.RefObject<ScrollView>);
  }, [registerScrollRef]);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [serviceCategories, listings, userPreferences] = await Promise.all([
        getServiceCategories().catch(() => []),
        getServiceListings(),
        getUserPreferences().catch(() => ({})),
      ]);

      setServices(listings);

      const nextCategoryMap: Record<string, number> = {};
      serviceCategories.forEach(item => {
        if (item?.name && item?.id) {
          nextCategoryMap[item.name] = item.id;
        }
      });

      setCategoryMap(nextCategoryMap);
      setCategoryOptions(['All', ...Object.keys(nextCategoryMap)]);

      const savedItems = Array.isArray(userPreferences?.savedItems)
        ? userPreferences.savedItems
        : [];
      const nextSavedMap: Record<string, boolean> = {};
      savedItems.forEach((item: {id?: string | number; type?: string}) => {
        if (String(item?.type) === 'service' && item?.id !== undefined) {
          nextSavedMap[String(item.id)] = true;
        }
      });
      setSavedServiceMap(nextSavedMap);
    } catch (_error) {
      setError('Unable to load services right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  const onToggleWishlist = async (service: Product) => {
    const key = String(service.id);
    const wasSaved = Boolean(savedServiceMap[key]);

    setSavedServiceMap(current => ({
      ...current,
      [key]: !wasSaved,
    }));

    try {
      const nextState = await toggleSavedPreference('service', {
        type: 'service',
        id: key,
        title: service.name,
        subtitle: service.serviceArea || service.sellerName || '',
        image: service.imageUrl,
        link: `/services/${service.id}`,
      });

      setSavedServiceMap(current => ({
        ...current,
        [key]: nextState,
      }));
    } catch {
      setSavedServiceMap(current => ({
        ...current,
        [key]: wasSaved,
      }));
    }
  };

  useEffect(() => {
    loadServices();
  }, [loadServices]);

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

  const onSearchFilterPress = () => {
    const firstCategory = categoryOptions.find(option => option !== 'All');

    if (activeCategory !== 'All') {
      setActiveCategory('All');
      setVisibleCount(PAGE_SIZE);
      return;
    }

    if (firstCategory) {
      setActiveCategory(firstCategory);
      setVisibleCount(PAGE_SIZE);
    }
  };

  return (
    <View style={styles.container}>
      <Header goBack title="Services" />
      <AnimatedHeaderScrollView
        ref={scrollViewRef}
        headerHeight={normalize(160)}
        onRefresh={loadServices}
        refreshMessage="Refreshing services"
        headerContent={
          <View style={styles.heroShell}>
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Find trusted field services fast</Text>
              <Text style={styles.heroSubtitle}>
                Discover verified technicians, compare offers, and save favorites.
              </Text>
            </View>
            <SearchBar
              hasFilter
              placeholder="Search services or providers"
              value={search}
              onChangeText={setSearch}
              onFilterPress={onSearchFilterPress}
              isFilterActive={activeCategory !== 'All'}
            />
          </View>
        }>
        <View style={styles.topRow}>
          <Pressable onPress={() => navigation.navigate('MyServiceRequests')}>
            <Text style={styles.linkText}>My Requests</Text>
          </Pressable>
          <Text style={styles.resultCount}>
            {visibleServices.length} {visibleServices.length === 1 ? 'service' : 'services'}
          </Text>
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
          <ProductList
            productLists={pagedServices}
            onPress={showService}
            cardVariant="service"
            wishlistById={savedServiceMap}
            onToggleWishlist={onToggleWishlist}
          />
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
  heroShell: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(4),
    paddingBottom: normalize(6),
    gap: normalize(10),
  },
  heroCard: {
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: '#E5E9F1',
    backgroundColor: '#F8FAFD',
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(12),
  },
  heroTitle: {
    color: '#1A2333',
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.MEDIUM,
  },
  heroSubtitle: {
    marginTop: normalize(4),
    color: '#5E687B',
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.XSMALL,
    lineHeight: normalize(18),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  resultCount: {
    color: '#677083',
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.XSMALL,
  },
});

export default Services;
