import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UserContext } from '../utils/userContext';
import api from '../utils/api';
import Toast from 'react-native-toast-message';

/**
 * Enhanced Checkout Screen
 *
 * Features:
 * - Delivery address input with icon
 * - Order summary card
 * - Item breakdown
 * - Delivery fee calculation
 * - Total with taxes
 * - Place order button
 * - Loading state
 */

const Checkout = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { mappedItems, user } = useContext(UserContext);

  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const subtotal = mappedItems.reduce(
    (sum, item) => sum + item.offerPrice * item.quantity,
    0,
  );
  const deliveryFee = 40;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Address Required',
        text2: 'Please enter your delivery address',
      });
      return;
    }

    if (!phone.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Phone Required',
        text2: 'Please enter your phone number',
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: mappedItems.map(item => ({
          itemId: item._id,
          quantity: item.quantity,
          price: item.offerPrice,
        })),
        deliveryAddress: address,
        phone,
        subtotal,
        deliveryFee,
        tax,
        total,
      };

      const res = await api.post('/orders/create', orderData);

      if (res.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Order Placed!',
          text2: 'Your order has been confirmed',
        });

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [
              { name: 'Home' },
              {
                name: 'OrderSuccess',
                params: { orderId: res.data.orderId },
              },
            ],
          });
        }, 1000);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: error?.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        {/* Delivery Details */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>

          <View style={styles.inputCard}>
            <Icon name="map-pin" size={18} color="#6b7280" />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <input
                style={styles.input}
                placeholder="Enter your full address"
                placeholderTextColor="#9ca3af"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.inputCard}>
            <Icon name="phone" size={18} color="#6b7280" />
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#9ca3af"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </Animated.View>

        {/* Order Items */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>

          <View style={styles.card}>
            {mappedItems.map((item, index) => (
              <View key={item._id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  ₹{item.offerPrice * item.quantity}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.totalContainer}>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalValue}>₹{total.toFixed(2)}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.placeOrderButton,
            pressed && { opacity: 0.8 },
            loading && { opacity: 0.6 },
          ]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </Text>
          <Icon name="check-circle" size={20} color="#fff" />
        </Pressable>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default Checkout;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  placeholder: {
    width: 40,
  },

  /* Content */
  content: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  /* Input Cards */
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
  },

  inputContainer: {
    flex: 1,
    marginLeft: 12,
  },

  inputLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },

  input: {
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },

  /* Cards */
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  /* Item Rows */
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },

  itemInfo: {
    flex: 1,
    marginRight: 12,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },

  itemQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  /* Summary */
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4f46e5',
  },

  /* Bottom Bar */
  bottomBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalContainer: {},

  bottomTotalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },

  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  placeOrderButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
