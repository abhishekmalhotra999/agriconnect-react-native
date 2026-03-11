import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MyProductsScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import MyProductList from '../../../components/Vendor/MyProduct/MyProductList';
import SearchBar from '../../../components/UI/SearchBar';
import AnimatedHeaderScrollView from '../../../components/UI/AnimatedScrollView';
import { useScrollContext } from '../../../contexts/ScrollContext';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import { Product } from '../../../models/Product';
import {getMyMarketplaceProducts} from '../../../api/marketplace.api';
import ErrorText from '../../../components/UI/ErrorText';
import {useFocusEffect} from '@react-navigation/native';
import Button from '../../../components/UI/Button';
import {userContext} from '../../../contexts/UserContext';
import {getMyServiceListings} from '../../../api/services.api';
import {updateMarketplaceProduct} from '../../../api/marketplace.api';

const MyProducts: React.FC<MyProductsScreenProps> = ({ navigation }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();
  const {user} = userContext();
  const [products, setProducts] = useState<Product[]>([]);
    const normalizedRole =
      (user?.accountType || user?.profile?.professionType || '').toLowerCase?.() ||
      '';
    const isTechnician = normalizedRole === 'technician';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [togglingProductId, setTogglingProductId] = useState<number | string | null>(null);

  function editProduct(product: Product) {
    navigation.navigate('MyProductDetails', { product })
  }

  function quickEditProduct(product: Product) {
    navigation.navigate('ManageMyProduct', {product});
  }

  useEffect(() => {
    registerScrollRef('Products', scrollViewRef);
  }, [registerScrollRef]);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;

      const loadProducts = async () => {
        try {
          setLoading(true);
          setError('');
          const finalResult = isTechnician
            ? await getMyServiceListings()
            : await getMyMarketplaceProducts();
          if (mounted) {
            setProducts(finalResult);
          }
        } catch (apiError) {
          if (mounted) {
            setError('Unable to load your products right now.');
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

      loadProducts();

      return () => {
        mounted = false;
      };
    }, [isTechnician]),
  );

  const visibleProducts = products.filter(item => {
    const status = String(item.status || 'draft').toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const statusMatch = statusFilter === 'all' || status === statusFilter;
    const searchMatch =
      !query ||
      String(item.name || '').toLowerCase().includes(query) ||
      String(item.category || '').toLowerCase().includes(query) ||
      String(item.description || '').toLowerCase().includes(query);
    return statusMatch && searchMatch;
  });

  const togglePublish = async (product: Product) => {
    if (isTechnician) {
      return;
    }

    const nextStatus = product.status === 'published' ? 'draft' : 'published';
    const priceValue = Number(product.unitPrice ?? String(product.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const stockValue = Number(product.stockQuantity || 0);

    try {
      setError('');
      setTogglingProductId(product.id);
      await updateMarketplaceProduct(Number(product.id), {
        title: product.name,
        description: product.description,
        categoryId: product.categoryId || null,
        unitPrice: priceValue,
        salePrice: product.salePrice,
        stockQuantity: stockValue,
        status: nextStatus,
        mainPictureUrl: product.imageUrl,
      });

      setProducts(prev =>
        prev.map(item =>
          String(item.id) === String(product.id)
            ? {
                ...item,
                status: nextStatus,
              }
            : item,
        ),
      );
    } catch (toggleError: any) {
      const message =
        String(toggleError?.message || '').trim() ||
        'Unable to update product status right now.';
      setError(message);
    } finally {
      setTogglingProductId(null);
    }
  };

  function goToCreateProduct() {
    navigation.navigate('ManageMyProduct', {});
  }

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView
        ref={scrollViewRef}
        headerHeight={normalize(50)}
        headerContent={(
          <>
          <SearchBar
            hasFilter={true}
            placeholder={isTechnician ? 'Search services..' : 'Search products..'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterRow}>
            <TouchableOpacity
              testID="seller-filter-all"
              onPress={() => setStatusFilter('all')}
              style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, statusFilter === 'all' && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="seller-filter-published"
              onPress={() => setStatusFilter('published')}
              style={[
                styles.filterChip,
                statusFilter === 'published' && styles.filterChipActive,
              ]}>
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === 'published' && styles.filterChipTextActive,
                ]}>
                Published
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="seller-filter-draft"
              onPress={() => setStatusFilter('draft')}
              style={[styles.filterChip, statusFilter === 'draft' && styles.filterChipActive]}>
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === 'draft' && styles.filterChipTextActive,
                ]}>
                Draft
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            label={isTechnician ? 'Add Service' : 'Add Product'}
            style={styles.addButton}
            labelStyle={styles.addButtonText}
            onPress={goToCreateProduct}
            disabled={false}
          />
          </>
        )}
      > 
          {loading ? (
            <ActivityIndicator style={styles.loader} color={COLORS.primary} />
          ) : (
            <MyProductList
              myProductLists={visibleProducts}
              onPress={editProduct}
              onEdit={quickEditProduct}
              onTogglePublish={togglePublish}
              showPublishToggle={!isTechnician}
              togglingProductId={togglingProductId}
            />
          )}
          {!loading && visibleProducts.length === 0 ? (
            <Text style={styles.emptyText}>No matching items found.</Text>
          ) : null}
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
  addButton: {
    marginHorizontal: normalize(16),
    marginTop: normalize(10),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(30),
  },
  addButtonText: {
    color: COLORS.primary,
  },
  filterRow: {
    marginTop: normalize(8),
    marginHorizontal: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#D4DCE8',
    borderRadius: normalize(14),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    marginRight: normalize(8),
    backgroundColor: COLORS.white,
  },
  filterChipActive: {
    backgroundColor: '#EAF5ED',
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: '#606A7B',
    fontSize: normalize(11),
  },
  filterChipTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: normalize(16),
    textAlign: 'center',
    color: '#7D8798',
    fontSize: normalize(12),
  },
});

export default MyProducts;
