
import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { Input } from '../components/ui/Input';
import { Picker } from '../components/ui/Picker';
import { Button } from '../components/button';
import { Card } from '../components/ui/Card';
import { useInventory } from '../contexts/InventoryContext';
import { useAuth } from '../contexts/AuthContext';

export default function AddMovementScreen() {
  const { user } = useAuth();
  const { products, addMovement } = useInventory();
  const [formData, setFormData] = useState({
    productId: '',
    type: 'inbound' as 'inbound' | 'outbound',
    quantity: '',
    reason: '',
    supplier: '',
    destination: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = products.find(p => p.id === formData.productId);

  const productItems = products.map(product => ({
    label: `${product.name} (${product.sku}) - ${product.quantityInStock} ${product.unitOfMeasure}`,
    value: product.id,
  }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productId) newErrors.productId = 'Please select a product';
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    if (formData.type === 'inbound' && !formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required for inbound movements';
    }
    if (formData.type === 'outbound') {
      if (!formData.destination.trim()) {
        newErrors.destination = 'Destination is required for outbound movements';
      }
      if (selectedProduct && Number(formData.quantity) > selectedProduct.quantityInStock) {
        newErrors.quantity = 'Cannot remove more than current stock';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedProduct || !user) return;

    setIsSubmitting(true);
    console.log('Adding stock movement:', formData);

    try {
      const quantity = Number(formData.quantity);
      const previousQuantity = selectedProduct.quantityInStock;
      const newQuantity = formData.type === 'inbound' 
        ? previousQuantity + quantity 
        : previousQuantity - quantity;

      addMovement({
        productId: formData.productId,
        type: formData.type,
        quantity,
        previousQuantity,
        newQuantity,
        reason: formData.reason.trim(),
        supplier: formData.supplier.trim() || undefined,
        destination: formData.destination.trim() || undefined,
        warehouseClerkId: user.id,
        warehouseClerkName: user.name,
        notes: formData.notes.trim() || undefined,
      });

      Alert.alert('Success', 'Stock movement logged successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error adding movement:', error);
      Alert.alert('Error', 'Failed to log movement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={commonStyles.wrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: 'Log Movement',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={commonStyles.container}>
        <View style={{ paddingTop: 16, paddingBottom: 32 }}>
          <Text style={[commonStyles.title, { marginBottom: 24 }]}>
            Log Stock Movement
          </Text>

          {/* Product Selection */}
          <Picker
            label="Product *"
            items={productItems}
            selectedValue={formData.productId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
            placeholder="Select a product..."
            error={errors.productId}
          />

          {/* Current Stock Info */}
          {selectedProduct && (
            <Card style={{ marginBottom: 16 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                Current Stock Information
              </Text>
              <View style={[commonStyles.row, { marginBottom: 4 }]}>
                <Text style={commonStyles.text}>Current Quantity:</Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {selectedProduct.quantityInStock} {selectedProduct.unitOfMeasure}
                </Text>
              </View>
              <View style={[commonStyles.row, { marginBottom: 4 }]}>
                <Text style={commonStyles.text}>Location:</Text>
                <Text style={commonStyles.text}>{selectedProduct.location}</Text>
              </View>
              <View style={[commonStyles.row]}>
                <Text style={commonStyles.text}>Low Stock Threshold:</Text>
                <Text style={commonStyles.text}>{selectedProduct.lowStockThreshold}</Text>
              </View>
            </Card>
          )}

          {/* Movement Type */}
          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8, fontWeight: '500' }]}>
              Movement Type *
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                variant={formData.type === 'inbound' ? 'primary' : 'secondary'}
                onPress={() => setFormData(prev => ({ ...prev, type: 'inbound' }))}
                style={{ flex: 1 }}
              >
                📥 Inbound
              </Button>
              <Button
                variant={formData.type === 'outbound' ? 'primary' : 'secondary'}
                onPress={() => setFormData(prev => ({ ...prev, type: 'outbound' }))}
                style={{ flex: 1 }}
              >
                📤 Outbound
              </Button>
            </View>
          </View>

          <Input
            label="Quantity *"
            value={formData.quantity}
            onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
            placeholder="Enter quantity"
            keyboardType="numeric"
            error={errors.quantity}
          />

          <Input
            label="Reason *"
            value={formData.reason}
            onChangeText={(text) => setFormData(prev => ({ ...prev, reason: text }))}
            placeholder="Initial stock, Customer order, Damaged goods, etc."
            error={errors.reason}
          />

          {formData.type === 'inbound' && (
            <Input
              label="Supplier *"
              value={formData.supplier}
              onChangeText={(text) => setFormData(prev => ({ ...prev, supplier: text }))}
              placeholder="Enter supplier name"
              error={errors.supplier}
            />
          )}

          {formData.type === 'outbound' && (
            <Input
              label="Destination *"
              value={formData.destination}
              onChangeText={(text) => setFormData(prev => ({ ...prev, destination: text }))}
              placeholder="Order #1001, Damaged goods disposal, etc."
              error={errors.destination}
            />
          )}

          <Input
            label="Notes"
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Optional additional notes"
            multiline
            numberOfLines={3}
          />

          {/* Preview */}
          {selectedProduct && formData.quantity && !isNaN(Number(formData.quantity)) && (
            <Card style={{ marginBottom: 16, backgroundColor: colors.backgroundAlt }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                Movement Preview
              </Text>
              <View style={[commonStyles.row, { marginBottom: 4 }]}>
                <Text style={commonStyles.text}>Current Stock:</Text>
                <Text style={commonStyles.text}>{selectedProduct.quantityInStock}</Text>
              </View>
              <View style={[commonStyles.row, { marginBottom: 4 }]}>
                <Text style={commonStyles.text}>
                  {formData.type === 'inbound' ? 'Adding:' : 'Removing:'}
                </Text>
                <Text style={[commonStyles.text, { 
                  color: formData.type === 'inbound' ? colors.success : colors.warning 
                }]}>
                  {formData.type === 'inbound' ? '+' : '-'}{formData.quantity}
                </Text>
              </View>
              <View style={[commonStyles.row]}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>New Stock:</Text>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {formData.type === 'inbound' 
                    ? selectedProduct.quantityInStock + Number(formData.quantity)
                    : selectedProduct.quantityInStock - Number(formData.quantity)
                  }
                </Text>
              </View>
            </Card>
          )}

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
              Log Movement
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
