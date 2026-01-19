import { StyleSheet, Text, View } from 'react-native';
import Items from '../utils/ItemCard';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../utils/api';
import Loader from '../utils/Loader';
import Toast from 'react-native-toast-message';

const CategoryItem = () => {
  const route = useRoute();
  const { category } = route.params;
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItemByCategory = async () => {
    try {
      const res = await api.get(
        `/items/category/${encodeURIComponent(category)}`,
      );

      // ✅ sort alphabetically by name
      // const sortedItems = (res.data.items || []).sort((a, b) =>
      //   a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      // );

      setItems(res.data.items || []);
    } catch (error) {
      console.log('Category API error:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to load items',
        text2: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemByCategory();
  }, []);

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.subtitle}>Showing results for</Text>
        <Text style={styles.title}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Text>
      </View>

      {/* Items Grid */}
      <Items items={items} />

      <Toast />
    </View>
  );
};

export default CategoryItem;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
});
