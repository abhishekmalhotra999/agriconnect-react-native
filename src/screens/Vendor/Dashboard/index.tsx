import React, {useMemo, useRef, useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
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
import {
  FarmerOnboarding,
  getUserPreferences,
} from '../../../api/preferences.api';
import {Product} from '../../../models/Product';

const Dashboard: React.FC<DashboardScreenProps> = ({navigation}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    registerScrollRef('DASHBOARD_TAB', scrollViewRef);
  }, [registerScrollRef]);

  useEffect(() => {
    let mounted = true;

    Promise.all([getMyMarketplaceProducts(), getUserPreferences()])
      .then(([productsResponse, preferencesResponse]) => {
        if (!mounted) {
          return;
        }

        setProducts(productsResponse || []);
        setOnboarding(preferencesResponse?.farmerOnboarding || {completed: false});
        setSellerStatus(preferencesResponse?.sellerStatus || 'pending');
        setSellerStatusReason(preferencesResponse?.sellerStatusReason || null);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setError('Failed to load seller dashboard data.');
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

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

  const netSales = products.reduce(
    (sum, product) =>
      sum + Number(product.unitPrice || 0) * Number(product.stockQuantity || 0),
    0,
  );
  const earnings = Math.round(netSales * 0.5);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomSpacing}
        >
        <Chart labels={chartData.labels} values={chartData.values} />
        <Button
          label="Add Product"
          style={styles.addButton}
          labelStyle={styles.addButtonLabel}
          onPress={() => (navigation as any).navigate('ManageMyProduct')}
          disabled={false}
        />
        <Separator/>
        <View style={styles.row}>
          <Card style={styles.cardStyle}>
            <Price label="Net Sales" value={netSales.toFixed(2)} />
          </Card>
          <Card style={styles.cardStyle}>
            <Price label="Earnings" value={earnings.toFixed(2)} />
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
            <Text style={styles.infoText}>No products yet.</Text>
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
