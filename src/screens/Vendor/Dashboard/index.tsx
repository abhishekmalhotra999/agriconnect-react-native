import React, {useMemo, useRef, useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { DashboardScreenProps } from '../../../navigation/types';
import Header from '../../../containers/header';
import Card from '../../../components/UI/Card';
import { useScrollContext } from '../../../contexts/ScrollContext';
import { normalize } from '../../../utils/util';
import { COLORS } from '../../../themes/styles';
import OrderStats from '../../../components/Vendor/Dashboard/OrderStats';
import ReviewStats from '../../../components/Vendor/Dashboard/ReviewStats';
import Separator from '../../../components/UI/Separator';
import Price from '../../../components/UI/Price';
import Chart from '../../../components/Vendor/Dashboard/Chart';
import Button from '../../../components/UI/Button';
import {getMyMarketplaceProducts} from '../../../api/marketplace.api';
import {getMyServiceListings} from '../../../api/services.api';
import {
  FarmerOnboarding,
  getUserPreferences,
} from '../../../api/preferences.api';
import {Product} from '../../../models/Product';
import Loading from '../../../components/UI/Loading';
import {userContext} from '../../../contexts/UserContext';

const Dashboard: React.FC<DashboardScreenProps> = ({navigation}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();
  const {user} = userContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [onboarding, setOnboarding] = useState<FarmerOnboarding>({
    completed: false,
  });
  const [sellerStatus, setSellerStatus] = useState<
    'pending' | 'approved' | 'rejected'
  >('pending');
  const [sellerStatusReason, setSellerStatusReason] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalizedRole =
    String(user?.accountType || user?.profile?.professionType || '').toLowerCase();
  const isTechnician = normalizedRole === 'technician';

  useEffect(() => {
    registerScrollRef('DASHBOARD_TAB', scrollViewRef);
  }, [registerScrollRef]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsResponse, preferencesResponse] = await Promise.all([
        isTechnician ? getMyServiceListings() : getMyMarketplaceProducts(),
        getUserPreferences(),
      ]);

      setProducts(productsResponse || []);
      setOnboarding(preferencesResponse?.farmerOnboarding || {completed: false});
      setSellerStatus(preferencesResponse?.sellerStatus || 'pending');
      setSellerStatusReason(preferencesResponse?.sellerStatusReason || null);
    } catch {
      setError('Failed to load seller dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [isTechnician]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboardData]);

  const stats = useMemo(() => {
    const published = products.filter(product => product.status === 'published').length;
    const draft = products.filter(product => product.status === 'draft').length;
    const lowStock = products.filter(
      product => Number(product.stockQuantity || 0) > 0 && Number(product.stockQuantity || 0) <= 5,
    ).length;
    const outOfStock = products.filter(
      product => Number(product.stockQuantity || 0) <= 0,
    ).length;
    const totalStockUnits = products.reduce(
      (sum, product) => sum + Number(product.stockQuantity || 0),
      0,
    );

    return {
      totalProducts: products.length,
      published,
      draft,
      lowStock,
      outOfStock,
      totalStockUnits,
    };
  }, [products]);

  const onboardingChecks = useMemo(() => {
    const checks = [
      Boolean(onboarding.storeName?.trim()),
      Boolean(onboarding.businessType?.trim()),
      Boolean(onboarding.serviceArea?.trim()),
      Boolean(onboarding.contactPhone?.trim()),
      Boolean(onboarding.contactEmail?.trim()),
      Boolean(onboarding.completed),
    ];

    const completedChecks = checks.filter(Boolean).length;

    return {
      completedChecks,
      totalChecks: checks.length,
    };
  }, [onboarding]);

  const chartData = useMemo(() => {
    const topProducts = products.slice(0, 6);

    if (topProducts.length === 0) {
      return {
        labels: ['Store'],
        values: [0],
      };
    }

    return {
      labels: topProducts.map(product => product.name.slice(0, 6) || 'Item'),
      values: topProducts.map(product => Number(product.stockQuantity || 0)),
    };
  }, [products]);

  const activeListings = stats.published;
  const pendingListings = stats.draft;
  const showSellerStatusBanner = !isTechnician && sellerStatus !== 'approved';
  const listingLabel = isTechnician ? 'Manage Services' : 'Manage Products';

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomSpacing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
        <Loading visible={refreshing} inline message="Refreshing seller dashboard" />
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
        <Chart labels={chartData.labels} values={chartData.values} />
        <Button
          label={isTechnician ? 'Add Service' : 'Add Product'}
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
          onPress={() => (navigation as any).navigate('ManageMyProduct')}
          disabled={false}
        />
        <Button
          label={isTechnician ? 'My Bookings' : 'My Orders'}
          style={styles.ordersButton}
          labelStyle={styles.ordersButtonLabel}
          onPress={() => (navigation as any).navigate('Orders')}
          disabled={false}
        />
        <Button
          label={listingLabel}
          style={styles.manageButton}
          labelStyle={styles.manageButtonLabel}
          onPress={() => (navigation as any).navigate('MyProducts')}
          disabled={false}
        />
        <Separator/>
        <View style={styles.row}>
          <Card style={styles.cardStyle}>
            <Price label="Active Listings" value={String(activeListings)} />
          </Card>
          <Card style={styles.cardStyle}>
            <Price label="Pending Listings" value={String(pendingListings)} />
          </Card>
        </View>
        {loading ? <Text style={styles.infoText}>Loading seller data...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Separator spacing={10}/>
        <Card label='Inventory'>
          <OrderStats
            totalProducts={stats.totalProducts}
            published={stats.published}
            draft={stats.draft}
            lowStock={stats.lowStock}
            outOfStock={stats.outOfStock}
            totalStockUnits={stats.totalStockUnits}
          />
        </Card>
        <Separator spacing={15}/>
        <Card label='Store Setup'>
          <ReviewStats
            sellerStatus={sellerStatus}
            sellerStatusReason={sellerStatusReason}
            onboarding={onboarding}
            completedChecks={onboardingChecks.completedChecks}
            totalChecks={onboardingChecks.totalChecks}
          />
        </Card>
        <Separator spacing={15} />
        <Card label="Recent Products">
          {products.length === 0 ? (
            <View>
              <Text style={styles.infoText}>No listings yet.</Text>
              <Button
                label={listingLabel}
                style={styles.inlineActionButton}
                labelStyle={styles.inlineActionLabel}
                onPress={() => (navigation as any).navigate('MyProducts')}
                disabled={false}
              />
            </View>
          ) : (
            products.slice(0, 5).map(item => (
              <View style={styles.recentRow} key={String(item.id)}>
                <Text style={styles.recentName}>{item.name}</Text>
                <Text style={styles.recentStatus}>{item.status || 'draft'}</Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bottomSpacing: {
    paddingBottom: normalize(120),
    padding: normalize(16),
  },
  cardStyle: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  infoText: {
    color: COLORS.grey,
    marginTop: normalize(8),
  },
  statusBanner: {
    borderRadius: normalize(12),
    borderWidth: 1,
    borderColor: '#F2D2A6',
    backgroundColor: '#FFF8EA',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    marginBottom: normalize(8),
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
  errorText: {
    color: COLORS.red,
    marginTop: normalize(8),
  },
  addButton: {
    marginTop: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(30),
  },
  addButtonLabel: {
    color: COLORS.primary,
  },
  ordersButton: {
    marginTop: normalize(8),
    borderWidth: 1,
    borderColor: '#D2D9E5',
    borderRadius: normalize(30),
    backgroundColor: COLORS.white,
  },
  ordersButtonLabel: {
    color: '#5A6374',
  },
  manageButton: {
    marginTop: normalize(8),
    borderRadius: normalize(30),
    backgroundColor: COLORS.primary,
  },
  manageButtonLabel: {
    color: COLORS.white,
  },
  inlineActionButton: {
    marginTop: normalize(10),
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: normalize(22),
    paddingHorizontal: normalize(12),
  },
  inlineActionLabel: {
    color: COLORS.primary,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(8),
  },
  recentName: {
    color: COLORS.grey,
  },
  recentStatus: {
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
});

export default Dashboard;
