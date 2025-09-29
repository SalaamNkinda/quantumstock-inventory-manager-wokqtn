
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { MovementCard } from '../../components/inventory/MovementCard';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '../../components/IconSymbol';
import { Button } from '../../components/button';

export default function MovementsScreen() {
  const { user } = useAuth();
  const { movements, products } = useInventory();
  const [filterBy, setFilterBy] = useState<'all' | 'inbound' | 'outbound'>('all');

  const canAddMovement = user?.role !== undefined; // All roles can add movements

  const filteredMovements = movements.filter(movement => {
    if (filterBy === 'all') return true;
    return movement.type === filterBy;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <View style={commonStyles.wrapper}>
      <ScrollView style={commonStyles.container}>
        <View style={{ paddingTop: 16, marginBottom: 24 }}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <View style={{ flex: 1 }}>
              <Text style={commonStyles.title}>Stock Movements</Text>
              <Text style={commonStyles.textSecondary}>
                {filteredMovements.length} movements
              </Text>
            </View>
            {canAddMovement && (
              <Pressable
                onPress={() => router.push('/add-movement')}
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
                  Log
                </Text>
              </Pressable>
            )}
          </View>

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
                All Movements
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => setFilterBy('inbound')}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: filterBy === 'inbound' ? colors.success : colors.backgroundAlt,
              }}
            >
              <Text style={{
                color: filterBy === 'inbound' ? 'white' : colors.text,
                fontWeight: '600',
              }}>
                Inbound
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => setFilterBy('outbound')}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: filterBy === 'outbound' ? colors.warning : colors.backgroundAlt,
              }}
            >
              <Text style={{
                color: filterBy === 'outbound' ? 'white' : colors.text,
                fontWeight: '600',
              }}>
                Outbound
              </Text>
            </Pressable>
          </View>
        </View>

        {filteredMovements.length > 0 ? (
          filteredMovements.map((movement) => {
            const product = products.find(p => p.id === movement.productId);
            return (
              <MovementCard
                key={movement.id}
                movement={movement}
                productName={product?.name}
              />
            );
          })
        ) : (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              No stock movements found.
            </Text>
            {canAddMovement && (
              <Button
                onPress={() => router.push('/add-movement')}
                style={{ marginTop: 16 }}
              >
                Log Your First Movement
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
