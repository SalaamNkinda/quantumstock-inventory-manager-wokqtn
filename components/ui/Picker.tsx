
import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import { IconSymbol } from '../IconSymbol';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerProps {
  items: PickerItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function Picker({ items, selectedValue, onValueChange, placeholder = "Select an option...", label, error }: PickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={[commonStyles.textSecondary, { marginBottom: 4, fontWeight: '500' }]}>
          {label}
        </Text>
      )}
      
      <Pressable
        onPress={() => setIsVisible(true)}
        style={[
          commonStyles.input,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
          error && { borderColor: colors.danger }
        ]}
      >
        <Text style={[
          commonStyles.text,
          !selectedItem && { color: colors.textSecondary }
        ]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <IconSymbol name="chevron-down" size={16} color={colors.textSecondary} />
      </Pressable>

      {error && (
        <Text style={[commonStyles.textSecondary, { color: colors.danger, marginTop: 4 }]}>
          {error}
        </Text>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '60%',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <Text style={[commonStyles.subtitle, { marginBottom: 0 }]}>
                {label || 'Select Option'}
              </Text>
              <Pressable onPress={() => setIsVisible(false)}>
                <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
            
            <ScrollView>
              {items.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsVisible(false);
                  }}
                  style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    backgroundColor: selectedValue === item.value ? colors.primary + '10' : 'transparent',
                  }}
                >
                  <Text style={[
                    commonStyles.text,
                    selectedValue === item.value && { color: colors.primary, fontWeight: '600' }
                  ]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
