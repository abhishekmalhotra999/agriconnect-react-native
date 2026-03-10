import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZES } from '../../../themes/styles';
import { normalize } from '../../../utils/util';

const ShippingDetails: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shipping Details</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.name}>Michael Miller</Text>
        <Text style={styles.address}>
          70 Washington Square South, New York, NY 10012, United States
        </Text>
        <Text style={styles.phone}>+91 12345 67890</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: normalize(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    color: COLORS.eerieBlack,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
  },
  editText: {
    color: COLORS.eerieBlack,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
    textDecorationLine: 'underline',
  },
  addressContainer: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  name: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.MEDIUM,
  },
  address: {
    marginVertical: 5,
    color: COLORS.grey,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.REGULAR,
  },
  phone: {
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.REGULAR,
  },
});

export default ShippingDetails;