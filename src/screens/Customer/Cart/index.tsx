import React, {useCallback, useMemo, useState} from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import Header from '../../../containers/header';
import { normalize, bottomInsets } from '../../../utils/util';
import CartItem from '../../../components/Customer/Cart/CartItem';
import Summary from '../../../components/Customer/Cart/Summary';
import { COLORS } from '../../../themes/styles';
import CouponInput from '../../../components/Customer/Cart/CouponInput';
import CheckoutButton from '../../../components/Customer/Cart/CheckoutButton';
import DeliveryInstructions from '../../../components/Customer/Cart/DeliveryInstructions';
import useStatusBarStyle from '../../../hooks/useStatusBarStyle';
import {useFocusEffect} from '@react-navigation/native';
import {
  addPlacedMarketplaceOrder,
  CartLineItem,
  clearCartItems,
  getCartItems,
  getCartTotals,
  removeCartItem,
  updateCartItemQuantity,
} from '../../../store/cart.storage';
import {createMarketplaceOrderRequest} from '../../../api/marketplace.api';
import Loading from '../../../components/UI/Loading';
import ErrorText from '../../../components/UI/ErrorText';

const Cart: React.FC = () => {
  useStatusBarStyle('light-content', 'dark-content');
  const [cartItems, setCartItems] = useState<CartLineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch {
      setError('Unable to load cart right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart]),
  );

  const adjustQuantity = async (productId: string, nextQuantity: number) => {
    const next = await updateCartItemQuantity(productId, nextQuantity);
    setCartItems(next);
  };

  const removeItem = async (productId: string) => {
    const next = await removeCartItem(productId);
    setCartItems(next);
  };

  const checkout = async () => {
    if (cartItems.length === 0 || checkingOut) {
      return;
    }

    try {
      setCheckingOut(true);
      setError('');

      for (const item of cartItems) {
        await createMarketplaceOrderRequest(Number(item.productId), {
          quantity: Number(item.quantity || 1),
          message: `Order from cart checkout (${item.quantity} x ${item.name})`,
        });
      }

      await addPlacedMarketplaceOrder({
        items: cartItems,
        totalAmount: totals.total,
        totalAmountLabel: totals.totalLabel,
      });
      await clearCartItems();
      setCartItems([]);

      Alert.alert('Order placed', 'Your marketplace order has been placed successfully.');
    } catch (checkoutError: any) {
      setError(String(checkoutError?.message || 'Unable to checkout right now.'));
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: bottomInsets(10)}]}>
      <Header goBack={true} title='My Cart' />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Loading visible={loading} inline message="Loading cart" />
        {!!error && <ErrorText text={error} />}
        {!loading && cartItems.length > 0 ? (
          <Text style={styles.sectionCaption}>
            {totals.totalItems} item(s) ready for checkout
          </Text>
        ) : null}
        {!loading && cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty. Add products from marketplace.</Text>
        ) : null}
        {cartItems.map(item => (
          <CartItem
            key={item.productId}
            name={item.name}
            price={item.priceLabel}
            unitPriceLabel={item.priceLabel}
            lineTotalLabel={`R${(Number(item.unitPrice || 0) * Number(item.quantity || 0))
              .toFixed(2)
              .replace(/\.00$/, '')}`}
            imageUrl={item.imageUrl ? {uri: item.imageUrl} : require('../../../../assets/images/cart-item.png')}
            quantity={item.quantity}
            onDecrease={() => adjustQuantity(item.productId, item.quantity - 1)}
            onIncrease={() => adjustQuantity(item.productId, item.quantity + 1)}
            onRemove={() => removeItem(item.productId)}
          />
        ))}
        <CouponInput />
        <Summary
          totalItems={totals.totalItems}
          subtotalLabel={totals.subtotalLabel}
          deliveryLabel={totals.deliveryLabel}
          totalLabel={totals.totalLabel}
        />
        <DeliveryInstructions />
      </ScrollView>
      <CheckoutButton 
        onPress={checkout} 
        label={checkingOut ? 'Placing Order...' : 'Proceed to Checkout'}
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
    paddingTop: normalize(8),
  },
  sectionCaption: {
    color: '#6E778A',
    fontSize: normalize(12),
    marginBottom: normalize(10),
  },
  emptyText: {
    color: COLORS.grey,
    textAlign: 'center',
    marginVertical: normalize(16),
  },
  checkoutBtn: {
    marginTop: 0,
    borderRadius: normalize(30),
    marginHorizontal: normalize(16),
  }
});

export default Cart;