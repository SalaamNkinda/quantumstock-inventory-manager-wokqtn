
import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { commonStyles, colors } from '../../styles/commonStyles';
import { StockMovement } from '../../types/inventory';
import { IconSymbol } from '../IconSymbol';

interface MovementCardProps {
  movement: StockMovement;
  productName?: string;
}

export function MovementCard({ movement, productName }: MovementCardProps) {
  const isInbound = movement.type === 'inbound';
  const icon = isInbound ? 'arrow-down' : 'arrow-up';
  const badgeVariant = isInbound ? 'success' : 'warning';

  return (
    <Card>
      <View style={commonStyles.row}>
        <View style={{
          backgroundColor: isInbound ? colors.success + '20' : colors.warning + '20',
          borderRadius: 8,
          padding: 8,
          marginRight: 12,
        }}>
          <IconSymbol 
            name={icon as any} 
            size={20} 
            color={isInbound ? colors.success : colors.warning} 
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={[commonStyles.row, { marginBottom: 4 }]}>
            <Text style={[commonStyles.text, { fontWeight: '600', flex: 1 }]}>
              {productName || `Product ${movement.productId}`}
            </Text>
            <Badge variant={badgeVariant}>
              {isInbound ? '+' : '-'}{movement.quantity}
            </Badge>
          </View>

          <Text style={[commonStyles.textSecondary, { marginBottom: 2 }]}>
            {movement.reason}
          </Text>

          <View style={[commonStyles.row, { marginBottom: 2 }]}>
            <Text style={commonStyles.textSecondary}>
              By: {movement.warehouseClerkName}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {movement.timestamp.toLocaleDateString()}
            </Text>
          </View>

          {(movement.supplier || movement.destination) && (
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {movement.supplier ? `From: ${movement.supplier}` : `To: ${movement.destination}`}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}
