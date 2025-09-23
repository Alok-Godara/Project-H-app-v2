import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ListFilter as Filter } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface FilterButtonProps {
  onPress?: () => void;
}

export default function FilterButton({ onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Filter color={Colors.text.secondary} size={20} strokeWidth={2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
});