import React, { useRef, useEffect } from 'react';
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

const Dashboard: React.FC<DashboardScreenProps> = ({ route }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { registerScrollRef } = useScrollContext();

  useEffect(() => {
    registerScrollRef('DASHBOARD_TAB', scrollViewRef);
  }, [registerScrollRef]);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomSpacing}
        >
        <Chart />
        <Separator/>
        <View style={styles.row}>
          <Card style={styles.cardStyle}>
            <Price label="Net Sales" value='89.5k' />
          </Card>
          <Card style={styles.cardStyle}>
            <Price label="Earnings" value='45.90k' />
          </Card>
        </View>
        <Separator spacing={10}/>
        <Card label='Orders'>
          <OrderStats />
        </Card>
        <Separator spacing={15}/>
        <Card label='Reviews'>
          <ReviewStats />
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
});

export default Dashboard;
