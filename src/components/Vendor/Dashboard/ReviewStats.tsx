import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';
import {FarmerOnboarding} from '../../../api/preferences.api';

type ReviewStatsProps = {
  sellerStatus: 'pending' | 'approved' | 'rejected';
  sellerStatusReason?: string | null;
  onboarding: FarmerOnboarding;
  completedChecks: number;
  totalChecks: number;
};

const ReviewStats: React.FC<ReviewStatsProps> = ({
  sellerStatus,
  sellerStatusReason,
  onboarding,
  completedChecks,
  totalChecks,
}) => {
  return (
    <View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Verification</Text>
        <Text style={styles.totalValue}>{sellerStatus}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Checklist</Text>
        <Text style={styles.value}>
          {completedChecks}/{totalChecks}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Store Name</Text>
        <Text style={styles.value}>{onboarding.storeName ? 'Yes' : 'No'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Setup Submitted</Text>
        <Text style={styles.value}>{onboarding.completed ? 'Yes' : 'No'}</Text>
      </View>
      {sellerStatus !== 'approved' && sellerStatusReason ? (
        <Text style={[styles.label, styles.reasonText]}>{sellerStatusReason}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(10),
  },
  totalRow: {
    paddingBottom: 5,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  label: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.SMALL,
    letterSpacing: 0.4,
  },
  value: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.6,
  },
  positive: {
    color: COLORS.red,
  },
  negative: {
    color: COLORS.grey,
  },
  totalLabel: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
  },
  totalValue: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.REGULAR,
    letterSpacing: 0.6,
  },
  reasonText: {
    marginTop: normalize(10),
    color: COLORS.red,
  },
});

export default ReviewStats;