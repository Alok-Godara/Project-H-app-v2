import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Download, Eye, Share } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MedicalRecord } from '@/types/medical';

interface RecordCardProps {
  record: MedicalRecord;
  onView?: (id: string) => void;
  onShare?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export default function RecordCard({ record, onView, onShare, onDownload }: RecordCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  const isPrescription = record.type === 'prescription';
  // If you want to show upload status, you may need to join with documents or add a field
  const isUploaded = true;


  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.typeIndicator}>
          <Text style={styles.typeText}>
            {isPrescription ? 'Prescription' : 'Lab Report'}
          </Text>
        </View>
        <View style={[styles.statusBadge, isUploaded ? styles.uploadedBadge : styles.pendingBadge]}>
          <Text style={[styles.statusText, isUploaded ? styles.uploadedText : styles.pendingText]}>
            {isUploaded ? 'Uploaded' : 'Pending'}
          </Text>
        </View>
      </View>

      <Text style={styles.date}>{formatDate(record.event_date)}</Text>

      <View style={styles.details}>
        <Text style={styles.purpose}>{record.title}</Text>
        <Text style={styles.doctorName}>{record.provider_name}</Text>
        <Text style={styles.department}>{record.type}</Text>
        <Text style={styles.hospital}>{record.description}</Text>
      </View>

      {isUploaded && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={() => onView?.(record.id)}>
            <Eye color="#007AFF" size={16} />
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={() => onShare?.(record.id)}>
            <Share color="#34C759" size={16} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.actionButton, styles.downloadButton]} onPress={() => onDownload?.(record.id)}>
            <Download color="#8E8E93" size={16} />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity> */}
        </View>
      )}
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
    marginBottom: 8,
  },
  typeIndicator: {
    backgroundColor: Colors.softBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    ...Typography.caption,
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  uploadedBadge: {
    backgroundColor: '#E8F5E8',
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    ...Typography.caption,
    fontFamily: 'Inter-Medium',
  },
  uploadedText: {
    color: Colors.success,
  },
  pendingText: {
    color: Colors.warning,
  },
  date: {
    ...Typography.subtitle,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  details: {
    marginBottom: 16,
  },
  purpose: {
    ...Typography.body,
    color: Colors.text.primary,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  doctorName: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  department: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  hospital: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  laboratory: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  labAddress: {
    ...Typography.caption,
    color: Colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#E6F0FF',
  },
  shareButton: {
    backgroundColor: '#E8F5E8',
  },
  downloadButton: {
    backgroundColor: '#F2F2F7',
  },
  viewButtonText: {
    ...Typography.caption,
    color: '#007AFF',
    fontFamily: 'Inter-Medium',
  },
  shareButtonText: {
    ...Typography.caption,
    color: Colors.success,
    fontFamily: 'Inter-Medium',
  },
  downloadButtonText: {
    ...Typography.caption,
    color: '#8E8E93',
    fontFamily: 'Inter-Medium',
  },
});