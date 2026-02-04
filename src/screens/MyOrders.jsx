import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { FadeInDown } from 'react-native-reanimated';
import OrderCard from '../components/OrderCard';
import api from '../utils/api';
import Toast from 'react-native-toast-message';
import Loader from '../utils/Loader';

/**
 * Enhanced MyOrders Screen
 *
 * Features:
 * - Filter tabs (All, Preparing, Delivered)
 * - Pull to refresh
 * - Empty state
 * - Order cards with status
 * - Smooth animations
 */

const MyOrders = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const filterOptions = ['All', 'Preparing', 'On the way', 'Delivered'];

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/user');
      setOrders(res.data.orders || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load orders',
        text2: error?.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filteredOrders =
    activeFilter === 'All'
      ? orders
      : orders.filter(order => order.status === activeFilter);

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="package" size={60} color="#9ca3af" />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        {activeFilter === 'All'
          ? 'Start ordering your favorite food!'
          : `No ${activeFilter.toLowerCase()} orders`}
      </Text>
      <Pressable
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse Restaurants</Text>
      </Pressable>
    </View>
  );

  if (loading) return <Loader />;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Animated.View entering={FadeInDown} style={styles.headerContent}>
          <Icon name="package" size={24} color="#4f46e5" />
          <Text style={styles.headingTxt}>My Orders</Text>
        </Animated.View>

        {orders.length > 0 && (
          <View style={styles.orderCountBadge}>
            <Text style={styles.orderCountText}>{orders.length}</Text>
          </View>
        )}
      </View>

      {/* Filter Tabs */}
      <Animated.View
        entering={FadeInDown.delay(100)}
        style={styles.filterContainer}
      >
        {filterOptions.map(filter => (
          <Pressable
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item._id || item.orderId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4f46e5"
          />
        }
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item, index }) => (
          <OrderCard
            restaurantName={item.restaurantName || 'Restaurant'}
            status={item.status}
            total={item.total}
            orderId={item.orderId || item._id}
            orderDate={new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            items={item.items?.map(i => i.name) || []}
            onViewDetails={() =>
              navigation.navigate('OrderDetails', { order: item })
            }
            index={index}
          />
        )}
      />

      <Toast />
    </View>
  );
};

export default MyOrders;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  /* Header */
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  headingTxt: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  orderCountBadge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 30,
    alignItems: 'center',
  },

  orderCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Filters */
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },

  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  filterTabActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },

  filterTextActive: {
    color: '#fff',
  },

  /* List */
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },

  emptyIconContainer: {
    backgroundColor: '#f3f4f6',
    padding: 30,
    borderRadius: 50,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  browseButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },

  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
