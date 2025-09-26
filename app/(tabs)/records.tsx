import ImageModal from '@/components/ImageModal';
import RecordCard from '@/components/RecordCard';
import SectionHeader from '@/components/SectionHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { MedicalRecord } from '@/types/medical';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function RecordsScreen() {

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedFilter] = useState<'all' | 'prescription' | 'lab_report'>('all');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [PatientId] = useState<string>('396d9e5e-9ba6-4e9e-87e2-fcdcc94eceb8');
  // Image modal state
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  // Fetch records function
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const { data, error } = await import('@/Services/Supabase').then(({ supabase }) =>
      supabase
        .from('medical_events')
        .select('*')
        .eq('patient_id', PatientId)
        .order('created_at', { ascending: true })
    );
    if (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  }, [PatientId]);

  // Reload records every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [fetchRecords])
  );

  const filteredRecords = React.useMemo(() => {
    if (selectedFilter === 'all') return records;
    return records.filter(record => record.type === selectedFilter);
  }, [records, selectedFilter]);

  const groupRecordsByMonth = (records: MedicalRecord[]) => {
    const groups: { [key: string]: MedicalRecord[] } = {};
    records.forEach(record => {
      const date = new Date(record.event_date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(record);
    });
    return groups;
  };

  const groupedRecords = groupRecordsByMonth(filteredRecords);

  // const handleFilter = () => {
  //   // Implement filter modal
  //   console.log('Filter pressed');
  // };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'card' ? 'list' : 'card');
  };

  // Helper to get public URL from Supabase storage for a given medical_event_id
  const getDocumentPublicUrl = async (medical_event_id: string) => {
    const { supabase } = await import('@/Services/Supabase');
    // 1. Get file_url from documents table
    const { data, error } = await supabase
      .from('documents')
      .select('file_url')
      .eq('medical_event_id', medical_event_id)
      .single();
    if (error || !data || !data.file_url) {
      console.error('Error fetching document:', error);
      return null;
    }
    let filePath = data.file_url;
    console.log('[Supabase] file_url from DB:', filePath);
    // Remove leading bucket name if present
    if (filePath.startsWith('medical_data/')) {
      filePath = filePath.replace(/^medical_data\//, '');
    }
    // 2. Get public URL from Supabase storage (for public buckets)
    const { data: publicUrlData } = supabase.storage.from('medical_data').getPublicUrl(filePath);
    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error('Error getting public URL');
      return null;
    }
    console.log('[Supabase] publicUrl:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  };

  // View image in a modal or external viewer
  const handleView = async (id: string) => {
    const publicUrl = await getDocumentPublicUrl(id);
    if (!publicUrl) {
      alert('No image found for this record.');
      return;
    }
    console.log('[ImageModal] Showing image:', publicUrl);
    setModalImageUrl(publicUrl);
    setImageModalVisible(true);
  };

  // Download and share image
  const handleShare = async (id: string) => {
    const publicUrl = await getDocumentPublicUrl(id);
    if (!publicUrl) {
      alert('No image found for this record.');
      return;
    }
    
    try {
      if (!FileSystem.documentDirectory) {
        alert('Document directory not available');
        return;
      }
      
      // Download to temporary location
      const fileName = publicUrl.split('/').pop() || `medical_record_${Date.now()}.png`;
      const tempUri = FileSystem.documentDirectory + fileName;
      
      const { uri } = await FileSystem.downloadAsync(publicUrl, tempUri);
      
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        // Share the file - this will open the system share dialog
        // allowing users to save to gallery, share via apps, etc.
        await Sharing.shareAsync(uri, {
          mimeType: 'image/jpeg',
          dialogTitle: 'Save Medical Record Image'
        });
      } else {
        alert('Sharing is not available on this device. Image saved to app directory: ' + uri);
      }
    } catch (error) {
      alert('Download failed.');
      console.error('Download error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageModal
        visible={imageModalVisible}
        imageUrl={modalImageUrl}
        onClose={() => setImageModalVisible(false)}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Medical Records</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.viewToggle} onPress={handleViewModeToggle}>
            {/* {viewMode === 'card' ? (
              <List color={Colors.text.secondary} size={20} />
            ) : (
              <Grid color={Colors.text.secondary} size={20} />
            )} */}
          </TouchableOpacity>
          {/* <FilterButton onPress={handleFilter} /> */}
        </View>
      </View>

      {/* <View style={styles.filterTabs}> ... */}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading records...</Text>
        ) : (
          Object.entries(groupedRecords).map(([monthYear, records]) => (
            <View key={monthYear}>
              <SectionHeader title={monthYear} />
              <View style={styles.recordsContainer}>
                {records.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    onView={handleView}
                    onShare={handleShare}
                    // onDownload={handleDownload}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    ...Typography.title,
    color: Colors.text.primary,
    fontSize: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewToggle: {
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
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    fontFamily: 'Inter-Medium',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  recordsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});