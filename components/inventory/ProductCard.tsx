
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { commonStyles, colors } from '../../styles/commonStyles';
import { Product } from '../../types/inventory';
import { IconSymbol } from '../IconSymbol';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function ProductCard({ product, onPress, onEdit, onDelete, showActions = true }: ProductCardProps) {
  const isLowStock = product.quantityInStock <= product.lowStockThreshold;
  const stockStatus = isLowStock ? 'danger' : 'success';

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={commonStyles.row}>
          <View style={{ flex: 1 }}>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <Text style={[commonStyles.subtitle, { fontSize: 16, marginBottom: 0, flex: 1 }]}>
                {product.name}
              </Text>
              <Badge variant={stockStatus}>
                {product.quantityInStock} {product.unitOfMeasure}
              </Badge>
            </View>
            
            <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
              SKU: {product.sku}
            </Text>
            
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <Text style={commonStyles.textSecondary}>
                📍 {product.location}
              </Text>
              {product.unitPrice && (
                <Text style={[commonStyles.textSecondary, { fontWeight: '600' }]}>
                  ${product.unitPrice.toFixed(2)}
                </Text>
              )}
            </View>

            {isLowStock && (
              <View style={[commonStyles.row, { alignItems: 'center' }]}>
                <IconSymbol name="warning" size={16} color={colors.warning} />
                <Text style={[commonStyles.textSecondary, { color: colors.warning, marginLeft: 4 }]}>
                  Low stock (threshold: {product.lowStockThreshold})
                </Text>
              </View>
            )}
          </View>

          {showActions && (
            <View style={{ flexDirection: 'row', marginLeft: 12 }}>
              {onEdit && (
                <Pressable
                  onPress={onEdit}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: colors.backgroundAlt,
                    marginRight: 8,
                  }}
                >
                  <IconSymbol name="pencil" size={16} color={colors.primary} />
                </Pressable>
              )}
              {onDelete && (
                <Pressable
                  onPress={onDelete}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: colors.danger + '20',
                  }}
                >
                  <IconSymbol name="trash" size={16} color={colors.danger} />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}
