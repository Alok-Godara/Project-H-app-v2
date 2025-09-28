import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { ConsentRequest } from '@/types/medical';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// type ConsentRequest = {
//   id: string;
//   doctorName: string;
//   purpose: string;
//   date: string;
//   status: 'pending' | 'granted' | 'denied' | 'revoked';
// };

interface ConsentCardProps {
  request: ConsentRequest;
  onGrant?: (id: string) => void;
  onDeny?: (id: string) => void;
  onRevoke?: (id: string) => void;
}

export default function ConsentCard({ request, onGrant, onDeny, onRevoke }: ConsentCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return 'Request pending';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allowed':
        return Colors.success;
      case 'denied':
        return Colors.error;
      case 'revoked':
        return Colors.text.tertiary;
      default:
        return Colors.warning;
    }
  };

  const renderActions = () => {
    if (request.status === 'pending') {
      return (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.denyButton]}
            onPress={() => onDeny?.(request.id)}
          >
            <Text style={styles.denyButtonText}>Deny</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.grantButton]}
            onPress={() => onGrant?.(request.id)}
          >
            <Text style={styles.grantButtonText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (request.status === 'allowed') {
      return (
        <View style={styles.actions}>
          <View style={styles.statusIndicator}>
            <Text style={styles.grantedText}>Access Allowed</Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, styles.revokeButton]}
            onPress={() => onRevoke?.(request.id)}
          >
            <Text style={styles.revokeButtonText}>Revoke</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.statusIndicator}>
        <Text style={[styles.statusOnlyText, { color: getStatusColor(request.status) }]}>
          {request.status === 'denied' ? 'Access Denied' : 
           request.status === 'revoked' ? 'Access Revoked' : 
           request.status === 'allowed' ? 'Access Allowed' : 'Pending Review'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(request.granted_at)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.doctorName}>{request.providers.name}</Text>
      <Text style={styles.specialty}>{request.providers.specialty}</Text>
      <Text style={styles.licenseNumber}>License: {request.providers.license_number}</Text>

      {renderActions()}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    ...Typography.caption,
    fontFamily: 'Inter-Medium',
  },
  doctorName: {
    ...Typography.subtitle,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  purpose: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  specialty: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  licenseNumber: {
    ...Typography.caption,
    color: Colors.text.tertiary,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  grantButton: {
    backgroundColor: Colors.success,
  },
  denyButton: {
    backgroundColor: Colors.error,
  },
  revokeButton: {
    backgroundColor: Colors.text.tertiary,
  },
  grantButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
  denyButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
  revokeButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 14,
  },
  statusIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  grantedText: {
    ...Typography.button,
    color: Colors.success,
    fontSize: 14,
  },
  statusOnlyText: {
    ...Typography.button,
    fontSize: 14,
  },
});