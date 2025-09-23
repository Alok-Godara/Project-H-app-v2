import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid2x2 as Grid, List } from 'lucide-react-native';
import RecordCard from '@/components/RecordCard';
import SectionHeader from '@/components/SectionHeader';
import FilterButton from '@/components/FilterButton';
import { mockPrescriptions, mockLabReports } from '@/data/mockData';
import { MedicalRecord } from '@/types/medical';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function RecordsScreen() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'prescription' | 'lab_report'>('all');

  const allRecords = [...mockPrescriptions, ...mockLabReports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredRecords = allRecords.filter(record => 
    selectedFilter === 'all' || record.type === selectedFilter
  );

  const groupRecordsByMonth = (records: MedicalRecord[]) => {
    const groups: { [key: string]: MedicalRecord[] } = {};
    
    records.forEach(record => {
      const date = new Date(record.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(record);
    });
    
    return groups;
  };

  const groupedRecords = groupRecordsByMonth(filteredRecords);

  const handleFilter = () => {
    // Implement filter modal
    console.log('Filter pressed');
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'card' ? 'list' : 'card');
  };

  const handleView = (id: string) => {
    console.log('View record:', id);
  };

  const handleShare = (id: string) => {
    console.log('Share record:', id);
  };

  const handleDownload = (id: string) => {
    console.log('Download record:', id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Records</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.viewToggle} onPress={handleViewModeToggle}>
            {viewMode === 'card' ? (
              <List color={Colors.text.secondary} size={20} />
            ) : (
              <Grid color={Colors.text.secondary} size={20} />
            )}
          </TouchableOpacity>
          <FilterButton onPress={handleFilter} />
        </View>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.activeFilterTabText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'prescription' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('prescription')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'prescription' && styles.activeFilterTabText]}>
            Prescriptions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'lab_report' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('lab_report')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'lab_report' && styles.activeFilterTabText]}>
            Lab Reports
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedRecords).map(([monthYear, records]) => (
          <View key={monthYear}>
            <SectionHeader title={monthYear} />
            <View style={styles.recordsContainer}>
              {records.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onView={handleView}
                  onShare={handleShare}
                  onDownload={handleDownload}
                />
              ))}
            </View>
          </View>
        ))}
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