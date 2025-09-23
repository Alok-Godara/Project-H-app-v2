import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard as Edit3, Check, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

interface ProfileFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
}

export default function ProfileField({ label, value, onSave, multiline = false }: ProfileFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.input, multiline && styles.multilineInput]}
            value={editValue}
            onChangeText={setEditValue}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <X color={Colors.error} size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Check color={Colors.success} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.fieldContainer} onPress={() => setIsEditing(true)}>
          <Text style={[styles.value, multiline && styles.multilineValue]}>{value}</Text>
          <Edit3 color={Colors.text.tertiary} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: 6,
    fontFamily: 'Inter-Medium',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  value: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  multilineValue: {
    lineHeight: 20,
  },
  editContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...Typography.body,
    color: Colors.text.primary,
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
  },
  saveButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 16,
  },
});