
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Input } from '../../components/ui/Input';
import { ProductCard } from '../../components/inventory/ProductCard';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '../../components/IconSymbol';
import { Button } from '../../components/button';

export default function InventoryScreen() {
  const { user } = useAuth();
  const { products, deleteProduct } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'low-stock'>('all');

  const canEdit = user?.role === 'Administrator' || user?.role === 'Manager';

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterBy === 'low-stock') {
      return matchesSearch && product.quantityInStock <= product.lowStockThreshold;
    }
    
    return matchesSearch;
  });

  const handleDeleteProduct = (productId: string, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
            console.log('Product deleted:', productId);
          },
        },
      ]
    );
  };

  return (
    <View style={commonStyles.wrapper}>
      <ScrollView style={commonStyles.container}>
        <View style={{ paddingTop: 16, marginBottom: 24 }}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.title}>Inventory</Text>
              <Text style={commonStyles.textSecondary}>
                {filteredProducts.length} products
              </Text>
            </View>
            {canEdit && (
              <Pressable
                onPress={() => router.push('/add-product')}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <IconSymbol name="plus" size={20} color="white" />
                <Text style={{ color: 'white', marginLeft: 4, fontWeight: '600' }}>
                  Add
                </Text>
              </Pressable>
            )}
          </View>

          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ marginBottom: 16 }}
          />

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <Pressable
              onPress={() => setFilterBy('all')}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: filterBy === 'all' ? colors.primary : colors.backgroundAlt,
              }}
            >
              <Text style={{
                color: filterBy === 'all' ? 'white' : colors.text,
                fontWeight: '600',
              }}>
                All Products
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => setFilterBy('low-stock')}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: filterBy === 'low-stock' ? colors.warning : colors.backgroundAlt,
              }}
            >
              <Text style={{
                color: filterBy === 'low-stock' ? 'white' : colors.text,
                fontWeight: '600',
              }}>
                Low Stock
              </Text>
            </Pressable>
          </View>
        </View>

        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product-details?id=${product.id}`)}
              onEdit={canEdit ? () => router.push(`/edit-product?id=${product.id}`) : undefined}
              onDelete={canEdit ? () => handleDeleteProduct(product.id, product.name) : undefined}
              showActions={canEdit}
            />
          ))
        ) : (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              {searchQuery ? 'No products found matching your search.' : 'No products in inventory.'}
            </Text>
            {canEdit && !searchQuery && (
              <Button
                onPress={() => router.push('/add-product')}
                style={{ marginTop: 16 }}
              >
                Add Your First Product
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
