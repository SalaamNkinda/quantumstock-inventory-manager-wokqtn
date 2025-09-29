
import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { Input } from '../components/ui/Input';
import { Button } from '../components/button';
import { useInventory } from '../contexts/InventoryContext';
import { useAuth } from '../contexts/AuthContext';

export default function AddProductScreen() {
  const { user } = useAuth();
  const { addProduct } = useInventory();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    quantityInStock: '',
    unitOfMeasure: '',
    lowStockThreshold: '',
    location: '',
    category: '',
    description: '',
    unitPrice: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.quantityInStock.trim()) {
      newErrors.quantityInStock = 'Quantity is required';
    } else if (isNaN(Number(formData.quantityInStock)) || Number(formData.quantityInStock) < 0) {
      newErrors.quantityInStock = 'Quantity must be a valid number';
    }
    if (!formData.unitOfMeasure.trim()) newErrors.unitOfMeasure = 'Unit of measure is required';
    if (!formData.lowStockThreshold.trim()) {
      newErrors.lowStockThreshold = 'Low stock threshold is required';
    } else if (isNaN(Number(formData.lowStockThreshold)) || Number(formData.lowStockThreshold) < 0) {
      newErrors.lowStockThreshold = 'Threshold must be a valid number';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (formData.unitPrice && (isNaN(Number(formData.unitPrice)) || Number(formData.unitPrice) < 0)) {
      newErrors.unitPrice = 'Unit price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log('Adding new product:', formData);

    try {
      addProduct({
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        quantityInStock: Number(formData.quantityInStock),
        unitOfMeasure: formData.unitOfMeasure.trim(),
        lowStockThreshold: Number(formData.lowStockThreshold),
        location: formData.location.trim(),
        category: formData.category.trim() || undefined,
        description: formData.description.trim() || undefined,
        unitPrice: formData.unitPrice ? Number(formData.unitPrice) : undefined,
      });

      Alert.alert('Success', 'Product added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAdd = user?.role === 'Administrator' || user?.role === 'Manager';

  if (!canAdd) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center' }]}>
        <Stack.Screen options={{ title: 'Add Product' }} />
        <Text style={[commonStyles.text, { textAlign: 'center' }]}>
          You don't have permission to add products.
        </Text>
        <Button onPress={() => router.back()} style={{ marginTop: 16 }}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={commonStyles.wrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: 'Add Product',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={commonStyles.container}>
        <View style={{ paddingTop: 16, paddingBottom: 32 }}>
          <Text style={[commonStyles.title, { marginBottom: 24 }]}>
            Add New Product
          </Text>

          <Input
            label="SKU / Item ID *"
            value={formData.sku}
            onChangeText={(text) => setFormData(prev => ({ ...prev, sku: text }))}
            placeholder="Enter unique SKU"
            error={errors.sku}
          />

          <Input
            label="Product Name *"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            placeholder="Enter product name"
            error={errors.name}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="Quantity in Stock *"
                value={formData.quantityInStock}
                onChangeText={(text) => setFormData(prev => ({ ...prev, quantityInStock: text }))}
                placeholder="0"
                keyboardType="numeric"
                error={errors.quantityInStock}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Unit of Measure *"
                value={formData.unitOfMeasure}
                onChangeText={(text) => setFormData(prev => ({ ...prev, unitOfMeasure: text }))}
                placeholder="units, boxes, lbs"
                error={errors.unitOfMeasure}
              />
            </View>
          </View>

          <Input
            label="Low Stock Threshold *"
            value={formData.lowStockThreshold}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lowStockThreshold: text }))}
            placeholder="Alert when stock falls below this number"
            keyboardType="numeric"
            error={errors.lowStockThreshold}
          />

          <Input
            label="Location *"
            value={formData.location}
            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
            placeholder="A1-B2, Aisle 3 Bin 4"
            error={errors.location}
          />

          <Input
            label="Category"
            value={formData.category}
            onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
            placeholder="Electronics, Furniture, etc."
            error={errors.category}
          />

          <Input
            label="Unit Price"
            value={formData.unitPrice}
            onChangeText={(text) => setFormData(prev => ({ ...prev, unitPrice: text }))}
            placeholder="0.00"
            keyboardType="numeric"
            error={errors.unitPrice}
          />

          <Input
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Optional product description"
            multiline
            numberOfLines={3}
            error={errors.description}
          />

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <Button
              variant="secondary"
              onPress={() => router.back()}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              loading={isSubmitting}
              style={{ flex: 1 }}
            >
              Add Product
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
