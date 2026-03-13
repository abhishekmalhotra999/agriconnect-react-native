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
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
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
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState('');
  const [couponFeedbackType, setCouponFeedbackType] = useState<'success' | 'error' | undefined>(undefined);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryOverride, setDeliveryOverride] = useState<number | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliverySavedMessage, setDeliverySavedMessage] = useState('');
  const tabBarHeight = useBottomTabBarHeight();

  const checkoutBarBottom = useMemo(
    () => Math.max(normalize(12), tabBarHeight + bottomInsets(8)),
    [tabBarHeight],
  );
  const checkoutBarHeight = normalize(94);
  const contentBottomPadding = checkoutBarBottom + checkoutBarHeight + normalize(16);

  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);
  const effectiveDelivery = deliveryOverride === null ? totals.delivery : Math.max(0, deliveryOverride);
  const finalTotal = Math.max(0, totals.subtotal + effectiveDelivery - discountAmount);

  const formatCurrency = (amount: number) =>
    `R${Math.max(0, Number(amount || 0)).toFixed(2).replace(/\.00$/, '')}`;

  const effectiveSummary = useMemo(
    () => ({
      subtotalLabel: formatCurrency(totals.subtotal),
      deliveryLabel: formatCurrency(effectiveDelivery),
      totalLabel: formatCurrency(finalTotal),
    }),
    [effectiveDelivery, finalTotal, totals.subtotal],
  );

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

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    setCouponFeedback('');
    setCouponFeedbackType(undefined);

    if (!normalized) {
      setDiscountAmount(0);
      setDeliveryOverride(null);
      return;
    }

    if (normalized === 'SAVE10') {
      const discount = Number((totals.subtotal * 0.1).toFixed(2));
      setDiscountAmount(discount);
      setDeliveryOverride(null);
      setCouponFeedback(`Coupon applied. You saved ${formatCurrency(discount)}.`);
      setCouponFeedbackType('success');
      return;
    }

    if (normalized === 'FREESHIP') {
      setDiscountAmount(0);
      setDeliveryOverride(0);
      setCouponFeedback('Coupon applied. Delivery fee removed.');
      setCouponFeedbackType('success');
      return;
    }

    setDiscountAmount(0);
    setDeliveryOverride(null);
    setCouponFeedback('Invalid coupon code. Try SAVE10 or FREESHIP.');
    setCouponFeedbackType('error');
  };

  const saveDeliveryInstructions = () => {
    const text = deliveryInstructions.trim();
    setDeliverySavedMessage(text ? 'Delivery instructions saved.' : 'Delivery instructions cleared.');
    setTimeout(() => {
      setDeliverySavedMessage('');
    }, 1800);
  };

  const checkout = async () => {
    if (cartItems.length === 0 || checkingOut) {
      return;
    }

    try {
      setCheckingOut(true);
      setError('');

      for (const item of cartItems) {
        const couponPart = couponCode.trim() ? ` | coupon: ${couponCode.trim().toUpperCase()}` : '';
        const instructionsPart = deliveryInstructions.trim()
          ? ` | delivery instructions: ${deliveryInstructions.trim()}`
          : '';
        await createMarketplaceOrderRequest(Number(item.productId), {
          quantity: Number(item.quantity || 1),
          message: `Order from cart checkout (${item.quantity} x ${item.name})${couponPart}${instructionsPart}`,
        });
      }

      await addPlacedMarketplaceOrder({
        items: cartItems,
        totalAmount: finalTotal,
        totalAmountLabel: formatCurrency(finalTotal),
      });
      await clearCartItems();
      setCartItems([]);
      setCouponCode('');
      setDiscountAmount(0);
      setDeliveryOverride(null);
      setDeliveryInstructions('');
      setCouponFeedback('');

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
      <ScrollView contentContainerStyle={[styles.contentContainer, {paddingBottom: contentBottomPadding}]}>
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
        <CouponInput
          value={couponCode}
          onChangeText={setCouponCode}
          onApply={applyCoupon}
          disabled={checkingOut || cartItems.length === 0}
          feedbackText={couponFeedback}
          feedbackType={couponFeedbackType}
        />
        <Summary
          totalItems={totals.totalItems}
          subtotalLabel={effectiveSummary.subtotalLabel}
          deliveryLabel={effectiveSummary.deliveryLabel}
          totalLabel={effectiveSummary.totalLabel}
        />
        <DeliveryInstructions
          value={deliveryInstructions}
          onChangeText={setDeliveryInstructions}
          onSave={saveDeliveryInstructions}
          disabled={checkingOut || cartItems.length === 0}
          savedMessage={deliverySavedMessage}
        />
      </ScrollView>
      <View style={[styles.checkoutBar, {bottom: checkoutBarBottom}]}> 
        <CheckoutButton 
          onPress={checkout} 
          disabled={checkingOut || cartItems.length === 0}
          label={checkingOut ? 'Placing Order...' : cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
          style={[styles.checkoutBtn, cartItems.length === 0 && styles.checkoutBtnDisabled]}
        />
      </View>
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
  checkoutBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: normalize(12),
    paddingTop: normalize(8),
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopWidth: 1,
    borderTopColor: '#E8EDF5',
  },
  checkoutBtn: {
    marginTop: 0,
    borderRadius: normalize(30),
    marginHorizontal: normalize(16),
  },
  checkoutBtnDisabled: {
    backgroundColor: '#BFCBDD',
  },
});

export default Cart;