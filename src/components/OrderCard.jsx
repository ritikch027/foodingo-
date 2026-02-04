import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { FadeInDown } from 'react-native-reanimated';

/**
 * OrderCard Component - Enhanced version for My Orders screen
 *
 * Features:
 * - Multiple status variants (Preparing, On the way, Delivered)
 * - Animated entrance
 * - Color-coded status badges
 * - View details action
 *
 * @param {string} restaurantName - Restaurant name
 * @param {string} status - 'Preparing' | 'On the way' | 'Delivered'
 * @param {number} total - Total price
 * @param {string} orderId - Order ID
 * @param {string} orderDate - Order date
 * @param {array} items - Array of item names
 * @param {function} onViewDetails - Callback for view details
 * @param {number} index - Index for stagger animation
 */

const OrderCard = ({
  restaurantName,
  status = 'Preparing',
  total,
  orderId,
  orderDate,
  items = [],
  onViewDetails,
  index = 0,
}) => {
  const statusConfig = {
    Preparing: {
      color: '#f59e0b',
      bg: '#fef3c7',
      icon: 'clock',
    },
    'On the way': {
      color: '#3b82f6',
      bg: '#dbeafe',
      icon: 'truck',
    },
    Delivered: {
      color: '#22c55e',
      bg: '#dcfce7',
      icon: 'check-circle',
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.Preparing;

  return (
    <Animated.View entering={FadeInDown.delay(index * 80)} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {restaurantName}
          </Text>
          <Text style={styles.orderId}>#{orderId}</Text>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: currentStatus.bg }]}
        >
          <Icon
            name={currentStatus.icon}
            size={14}
            color={currentStatus.color}
          />
          <Text style={[styles.statusText, { color: currentStatus.color }]}>
            {status}
          </Text>
        </View>
      </View>

      {/* Items Preview */}
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsLabel}>Items:</Text>
        <Text style={styles.itemsText} numberOfLines={2}>
          {items.length > 0 ? items.join(', ') : 'Food items'}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.dateText}>{orderDate}</Text>
          <Text style={styles.totalText}>₹{total}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.detailsButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={onViewDetails}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Icon name="arrow-right" size={16} color="#fff" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default OrderCard;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  headerLeft: {
    flex: 1,
    marginRight: 12,
  },

  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  orderId: {
    fontSize: 14,
    color: '#6b7280',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  itemsContainer: {
    marginBottom: 12,
  },

  itemsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },

  itemsText: {
    fontSize: 14,
    color: '#374151',
  },

  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },

  totalText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },

  detailsButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  detailsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
