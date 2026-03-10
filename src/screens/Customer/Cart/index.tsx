import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from '../../../containers/header';
import { normalize, bottomInsets } from '../../../utils/util';
import CartItem from '../../../components/Customer/Cart/CartItem';
import ShippingDetails from '../../../components/Customer/Cart/ShippingDetails';
import Summary from '../../../components/Customer/Cart/Summary';
import { cartItemImage } from '../../../constants/images';
import { COLORS } from '../../../themes/styles';
import CouponInput from '../../../components/Customer/Cart/CouponInput';
import CheckoutButton from '../../../components/Customer/Cart/CheckoutButton';
import DeliveryInstructions from '../../../components/Customer/Cart/DeliveryInstructions';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';

const Cart: React.FC = () => {
  useStatusBarStyle('light-content', 'dark-content');

  function checkout() {}

  return (
    <View style={[styles.container, { paddingBottom: bottomInsets(10)}]}>
      <Header goBack={true} title='My Cart' />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CartItem name="Pomegranate" price="R100" imageUrl={cartItemImage} />
        <CouponInput />
        <Summary />
        <ShippingDetails />
        <DeliveryInstructions />
      </ScrollView>
      <CheckoutButton 
        onPress={checkout} 
        label="Proceed to Checkout"
        style={styles.checkoutBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(120),
  },
  checkoutBtn: {
    marginTop: 0,
    borderRadius: normalize(30),
    marginHorizontal: normalize(16),
  }
});

export default Cart;