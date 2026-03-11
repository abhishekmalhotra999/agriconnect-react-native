import React, {useRef, useEffect, useState, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { ProductsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import ProductList from '../../../components/Customer/Product/ProductList';
import SearchBar from '../../../components/UI/SearchBar';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import { useScrollContext } from '../../../contexts/ScrollContext';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Product } from '../../../models/Product';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import {getMarketplaceProducts} from '../../../api/marketplace.api';
import ErrorText from '../../../components/UI/ErrorText';
import {useFocusEffect} from '@react-navigation/native';

const PAGE_SIZE = 8;
type SortKey = 'newest' | 'priceAsc' | 'priceDesc' | 'stockDesc';

const normalizeCategoryKey = (value: string) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

const toProductPrice = (product: Product) => {
  if (typeof product.unitPrice === 'number' && !isNaN(product.unitPrice)) {
    return product.unitPrice;
  }

  const parsed = Number(String(product.price || '').replace(/[^0-9.]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const MarketplaceSkeletonGrid = () => {
  const shimmerTranslateX = useRef(new Animated.Value(-140)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerTranslateX, {
          toValue: 320,
          duration: 1100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslateX, {
          toValue: -140,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(180),
      ]),
    );

    shimmerLoop.start();
    return () => {
      shimmerLoop.stop();
    };
  }, [shimmerTranslateX]);

  return (
    <View style={styles.skeletonGrid}>
      {Array.from({length: 4}).map((_, index) => (
        <View key={`skeleton-${index}`} style={styles.skeletonCard}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shimmerBand,
              {transform: [{translateX: shimmerTranslateX}, {rotate: '18deg'}]},
            ]}
          />
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonBody}>
            <View style={[styles.skeletonLine, styles.skeletonLineTitle]} />
            <View style={[styles.skeletonLine, styles.skeletonLineSmall]} />
            <View style={[styles.skeletonLine, styles.skeletonLinePrice]} />
            <View style={styles.skeletonBadgesRow}>
              <View style={styles.skeletonBadge} />
              <View style={styles.skeletonBadgeShort} />
            </View>
            <Text style={styles.skeletonHint}>Loading...</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const Products: React.FC<ProductsScreenProps> = ({ navigation }) => {
  useStatusBarStyle('light-content', 'dark-content');
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [trustedOnly, setTrustedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>('');

  function show(product: Product) {
    navigation.navigate('ProductDetails', { product })
  }

  useEffect(() => {
    registerScrollRef('Products', scrollViewRef);
  }, [registerScrollRef]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getMarketplaceProducts();
      setProducts(result || []);
      setVisibleCount(PAGE_SIZE);
    } catch (apiError) {
      setError('Unable to load products right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach(item => {
      const category = String(item.category || '').trim();
      if (category) {
        unique.add(category);
      }
    });

    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const categoryKey = selectedCategory.trim().toLowerCase();
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter(product => {
      const name = String(product.name || '').toLowerCase();
      const description = String(
        product.shortDescription || product.description || '',
      ).toLowerCase();
      const category = String(product.category || '').toLowerCase();
      const stockCount = Number(product.stockQuantity || 0);

      const categoryMatch = !categoryKey || category === categoryKey;
      const searchMatch =
        !query ||
        name.includes(query) ||
        description.includes(query) ||
        category.includes(query);
      const stockMatch = !showOnlyInStock || stockCount > 0;
      const trustedMatch = !trustedOnly || stockCount >= 20;

      return categoryMatch && searchMatch && stockMatch && trustedMatch;
    });

    if (sortBy === 'priceAsc') {
      return [...filtered].sort((a, b) => toProductPrice(a) - toProductPrice(b));
    }

    if (sortBy === 'priceDesc') {
      return [...filtered].sort((a, b) => toProductPrice(b) - toProductPrice(a));
    }

    if (sortBy === 'stockDesc') {
      return [...filtered].sort(
        (a, b) => Number(b.stockQuantity || 0) - Number(a.stockQuantity || 0),
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, showOnlyInStock, trustedOnly, sortBy]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );

  const hasMore = visibleProducts.length < filteredProducts.length;

  const loadMoreProducts = useCallback(() => {
    if (loading || loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 250);
  }, [hasMore, loading, loadingMore]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
      const paddingToBottom = normalize(80);
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (isNearBottom) {
        loadMoreProducts();
      }
    },
    [loadMoreProducts],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory, showOnlyInStock, trustedOnly, sortBy]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('newest');
    setShowOnlyInStock(false);
    setTrustedOnly(false);
    setVisibleCount(PAGE_SIZE);
  }, []);

  return (
    <View style={styles.container}>
    <Header goBack={true} title='Products'/>
    <AnimatedHeaderScrollView
      testID="products-scroll"
      ref={scrollViewRef}
      headerHeight={normalize(50)}
      onMomentumScrollEnd={onMomentumScrollEnd}
      headerContent={(
        <>
        <SearchBar
          hasFilter={true}
          placeholder="Search products.."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          <TouchableOpacity
            testID="filter-category-all"
            onPress={() => setSelectedCategory('')}
            style={[
              styles.filterChip,
              !selectedCategory && styles.filterChipActive,
            ]}>
            <Text
              style={[
                styles.filterChipText,
                !selectedCategory && styles.filterChipTextActive,
              ]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map(category => {
            const categoryKey = normalizeCategoryKey(category);
            const isActive = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                testID={`filter-category-${categoryKey}`}
                onPress={() => setSelectedCategory(category)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}>
                <Text
                  style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          <TouchableOpacity
            testID="sort-newest"
            onPress={() => setSortBy('newest')}
            style={[styles.filterChip, sortBy === 'newest' && styles.filterChipActive]}>
            <Text
              style={[styles.filterChipText, sortBy === 'newest' && styles.filterChipTextActive]}>
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="sort-price-asc"
            onPress={() => setSortBy('priceAsc')}
            style={[styles.filterChip, sortBy === 'priceAsc' && styles.filterChipActive]}>
            <Text
              style={[styles.filterChipText, sortBy === 'priceAsc' && styles.filterChipTextActive]}>
              Price Low
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="sort-price-desc"
            onPress={() => setSortBy('priceDesc')}
            style={[styles.filterChip, sortBy === 'priceDesc' && styles.filterChipActive]}>
            <Text
              style={[styles.filterChipText, sortBy === 'priceDesc' && styles.filterChipTextActive]}>
              Price High
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="sort-stock-desc"
            onPress={() => setSortBy('stockDesc')}
            style={[styles.filterChip, sortBy === 'stockDesc' && styles.filterChipActive]}>
            <Text
              style={[styles.filterChipText, sortBy === 'stockDesc' && styles.filterChipTextActive]}>
              Most Stock
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          <TouchableOpacity
            testID="filter-in-stock"
            onPress={() => setShowOnlyInStock(prev => !prev)}
            style={[styles.filterChip, showOnlyInStock && styles.filterChipActive]}>
            <Text
              style={[
                styles.filterChipText,
                showOnlyInStock && styles.filterChipTextActive,
              ]}>
              In stock
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="filter-trusted"
            onPress={() => setTrustedOnly(prev => !prev)}
            style={[styles.filterChip, trustedOnly && styles.filterChipActive]}>
            <Text
              style={[styles.filterChipText, trustedOnly && styles.filterChipTextActive]}>
              Trusted
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="filter-reset"
            onPress={resetFilters}
            style={styles.filterChip}>
            <Text style={styles.filterChipText}>Reset</Text>
          </TouchableOpacity>
        </ScrollView>
        </>
      )}
      > 
        {loading ? (
          <MarketplaceSkeletonGrid />
        ) : (
          <ProductList productLists={visibleProducts} onPress={show} />
        )}
        {loadingMore && <ActivityIndicator testID="products-load-more-loader" style={styles.loader} color={COLORS.primary} />}
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
  filterRow: {
    paddingHorizontal: normalize(2),
    paddingTop: normalize(6),
    paddingBottom: normalize(2),
  },
  filterChip: {
    marginRight: normalize(8),
    borderWidth: 1,
    borderColor: '#D7DCE6',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    backgroundColor: COLORS.white,
  },
  filterChipActive: {
    backgroundColor: '#EAF5ED',
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: '#5F6775',
    fontSize: normalize(11),
  },
  filterChipTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  skeletonGrid: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(15),
    paddingBottom: normalize(120),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '48.5%',
    position: 'relative',
    borderRadius: normalize(14),
    borderWidth: 1,
    borderColor: '#F0F1F4',
    backgroundColor: COLORS.white,
    marginBottom: normalize(8),
    overflow: 'hidden',
  },
  shimmerBand: {
    position: 'absolute',
    top: -20,
    left: 0,
    width: normalize(120),
    height: '130%',
    backgroundColor: 'rgba(255,255,255,0.45)',
    zIndex: 2,
  },
  skeletonImage: {
    height: normalize(112),
    backgroundColor: '#EEF1F6',
  },
  skeletonBody: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
  },
  skeletonLine: {
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: '#EDF0F5',
    marginBottom: normalize(6),
  },
  skeletonLineTitle: {
    width: '86%',
    height: normalize(10),
  },
  skeletonLineSmall: {
    width: '62%',
  },
  skeletonLinePrice: {
    width: '48%',
    marginTop: normalize(4),
  },
  skeletonBadgesRow: {
    marginTop: normalize(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonBadge: {
    width: normalize(54),
    height: normalize(12),
    borderRadius: normalize(6),
    backgroundColor: '#E8ECF3',
    marginRight: normalize(5),
  },
  skeletonBadgeShort: {
    width: normalize(38),
    height: normalize(12),
    borderRadius: normalize(6),
    backgroundColor: '#E8ECF3',
  },
  skeletonHint: {
    marginTop: normalize(8),
    color: '#A0A7B6',
    fontSize: normalize(10),
  },
});

export default Products;