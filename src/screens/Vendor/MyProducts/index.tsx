import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
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
import {deleteMarketplaceProduct} from '../../../api/marketplace.api';
import ErrorText from '../../../components/UI/ErrorText';
import {useFocusEffect} from '@react-navigation/native';
import Button from '../../../components/UI/Button';
import {userContext} from '../../../contexts/UserContext';
import {getMyServiceListings} from '../../../api/services.api';
import {deleteServiceListing} from '../../../api/services.api';
import {updateServiceListing} from '../../../api/services.api';
import {updateMarketplaceProduct} from '../../../api/marketplace.api';
import {getUserPreferences} from '../../../api/preferences.api';

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
  const [deletingProductId, setDeletingProductId] = useState<number | string | null>(null);
  const [sellerStatus, setSellerStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [sellerStatusReason, setSellerStatusReason] = useState<string>('');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [finalResult, preferences] = await Promise.all([
        isTechnician
          ? getMyServiceListings()
          : getMyMarketplaceProducts(),
        !isTechnician ? getUserPreferences().catch(() => null) : Promise.resolve(null),
      ]);
      setProducts(finalResult);

      if (!isTechnician) {
        setSellerStatus(
          (preferences?.sellerStatus as 'pending' | 'approved' | 'rejected') || 'pending',
        );
        setSellerStatusReason(String(preferences?.sellerStatusReason || '').trim());
      }
    } catch {
      setError('Unable to load your products right now.');
    } finally {
      setLoading(false);
    }
  }, [isTechnician]);

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
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
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
    const nextStatus = product.status === 'published' ? 'draft' : 'published';

    try {
      setError('');
      setTogglingProductId(product.id);

      if (isTechnician) {
        await updateServiceListing(Number(product.id), {
          title: product.name,
          description: product.description,
          serviceCategoryId: product.categoryId || undefined,
          serviceArea: product.serviceArea,
          contactEmail: product.contactEmail,
          isActive: nextStatus === 'published',
          mainPictureUrl: product.imageUrl,
        });
      } else {
        const priceValue =
          Number(product.unitPrice ?? String(product.price || '0').replace(/[^0-9.]/g, '')) ||
          0;
        const stockValue = Number(product.stockQuantity || 0);

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
      }

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

  const performDelete = async (product: Product) => {
    try {
      setDeletingProductId(product.id);
      setError('');

      if (isTechnician) {
        await deleteServiceListing(Number(product.id));
      } else {
        await deleteMarketplaceProduct(Number(product.id));
      }

      setProducts(current =>
        current.filter(item => String(item.id) !== String(product.id)),
      );
    } catch (deleteError: any) {
      const message =
        String(deleteError?.message || '').trim() ||
        'Unable to delete this listing right now.';
      setError(message);
    } finally {
      setDeletingProductId(null);
    }
  };

  const confirmDeleteProduct = (product: Product) => {
    Alert.alert(
      isTechnician ? 'Delete service?' : 'Delete product?',
      'This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            performDelete(product);
          },
        },
      ],
    );
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  function goToCreateProduct() {
    navigation.navigate('ManageMyProduct', {});
  }

  const noItemsAtAll = products.length === 0;
  const showSellerStatusBanner = !isTechnician && sellerStatus !== 'approved';

  return (
    <View style={styles.container}>
      <Header />
      <AnimatedHeaderScrollView
        ref={scrollViewRef}
        headerHeight={normalize(74)}
        onRefresh={loadProducts}
        refreshMessage={isTechnician ? 'Refreshing services' : 'Refreshing products'}
        headerContent={(
          <SearchBar
            hasFilter={true}
            placeholder={isTechnician ? 'Search services..' : 'Search products..'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        )}
      >
          <View style={styles.manageToolbar}>
            <View style={styles.filterActionsRow}>
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
            </View>
          <Text style={styles.manageHintText}>
            Use Edit, Delete and Publish/Draft buttons on each listing card to manage quickly.
          </Text>
          <TouchableOpacity
            testID="seller-my-orders"
            style={styles.myOrdersLink}
            onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.myOrdersLinkText}>
              {isTechnician ? 'My Bookings' : 'My Orders'}
            </Text>
          </TouchableOpacity>
          </View>
          {showSellerStatusBanner ? (
            <View style={styles.statusBanner}>
              <Text style={styles.statusBannerTitle}>
                {sellerStatus === 'rejected'
                  ? 'Seller approval rejected'
                  : 'Seller approval pending'}
              </Text>
              <Text style={styles.statusBannerBody}>
                {sellerStatusReason ||
                  'Your listings can stay in draft until approval is completed.'}
              </Text>
            </View>
          ) : null}
          {loading ? (
            <ActivityIndicator style={styles.loader} color={COLORS.primary} />
          ) : (
            <MyProductList
              myProductLists={visibleProducts}
              onPress={editProduct}
              onEdit={quickEditProduct}
              onTogglePublish={togglePublish}
              onDelete={confirmDeleteProduct}
              showPublishToggle={true}
              togglingProductId={togglingProductId}
              deletingProductId={deletingProductId}
            />
          )}
          {!loading && visibleProducts.length === 0 ? (
            <View style={styles.emptyStateWrap}>
              <Text style={styles.emptyText}>
                {noItemsAtAll
                  ? isTechnician
                    ? 'No services yet. Start by creating your first service listing.'
                    : 'No products yet. Start by creating your first product listing.'
                  : 'No matching items found for current filters.'}
              </Text>
              <Button
                label={noItemsAtAll ? (isTechnician ? 'Add Service' : 'Add Product') : 'Reset Filters'}
                style={styles.emptyActionButton}
                labelStyle={styles.emptyActionText}
                onPress={noItemsAtAll ? goToCreateProduct : resetFilters}
                disabled={false}
              />
            </View>
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
  statusBanner: {
    marginTop: normalize(8),
    marginHorizontal: normalize(16),
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#F2D2A6',
    backgroundColor: '#FFF8EA',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
  },
  statusBannerTitle: {
    color: '#9A6400',
    fontWeight: '600',
    fontSize: normalize(12),
  },
  statusBannerBody: {
    marginTop: normalize(4),
    color: '#8A6A36',
    fontSize: normalize(11),
    lineHeight: normalize(16),
  },
  addButton: {
    marginTop: normalize(8),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(20),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: normalize(12),
  },
  manageHintText: {
    marginTop: normalize(8),
    color: COLORS.grey,
    fontSize: normalize(11),
  },
  myOrdersLink: {
    marginTop: normalize(8),
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#D4DCE8',
    borderRadius: normalize(14),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(4),
    backgroundColor: COLORS.white,
  },
  myOrdersLinkText: {
    color: '#5A6374',
    fontSize: normalize(11),
    fontWeight: '600',
  },
  manageToolbar: {
    marginTop: normalize(4),
    marginHorizontal: normalize(16),
    borderRadius: normalize(12),
    backgroundColor: '#F9FAFD',
    borderWidth: 1,
    borderColor: '#EEF1F6',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
  },
  filterActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterRow: {
    marginTop: normalize(2),
    flexDirection: 'row',
    flexWrap: 'nowrap',
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
  emptyStateWrap: {
    marginTop: 0,
    marginLeft: normalize(6),
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  emptyActionButton: {
    marginTop: normalize(10),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(24),
    paddingHorizontal: normalize(14),
  },
  emptyActionText: {
    color: COLORS.primary,
  },
});

export default MyProducts;
