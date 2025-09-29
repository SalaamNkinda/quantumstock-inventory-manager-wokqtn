
import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './Card';
import { commonStyles, colors } from '../../styles/commonStyles';
import { IconSymbol } from '../IconSymbol';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
}

export function StatsCard({ title, value, icon, color = colors.primary, subtitle }: StatsCardProps) {
  return (
    <Card style={{ flex: 1, marginHorizontal: 4 }}>
      <View style={commonStyles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
            {title}
          </Text>
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 0 }]}>
            {value}
          </Text>
          {subtitle && (
            <Text style={[commonStyles.textSecondary, { fontSize: 11 }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={{
          backgroundColor: color + '20',
          borderRadius: 8,
          padding: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <IconSymbol name={icon as any} size={24} color={color} />
        </View>
      </View>
    </Card>
  );
}
