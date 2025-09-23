import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConsentCard from '@/components/ConsentCard';
import FilterButton from '@/components/FilterButton';
import { mockConsentRequests } from '@/data/mockData';
import { ConsentRequest } from '@/types/medical';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function ConsentScreen() {
  const [requests, setRequests] = useState<ConsentRequest[]>(mockConsentRequests);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'granted' | 'denied'>('all');

  const filteredRequests = requests.filter(request => 
    selectedFilter === 'all' || request.status === selectedFilter
  );

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleGrant = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'granted' } : req
    ));
    Alert.alert('Access Granted', 'Doctor can now access your medical records.');
  };

  const handleDeny = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'denied' } : req
    ));
    Alert.alert('Access Denied', 'Doctor\'s request has been denied.');
  };

  const handleRevoke = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'revoked' } : req
    ));
    Alert.alert('Access Revoked', 'Doctor\'s access has been revoked.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consent Management</Text>
        <FilterButton onPress={handleFilter} />
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
          style={[styles.filterTab, selectedFilter === 'pending' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'pending' && styles.activeFilterTabText]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'granted' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('granted')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'granted' && styles.activeFilterTabText]}>
            Granted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'denied' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('denied')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'denied' && styles.activeFilterTabText]}>
            Denied
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.requestsContainer}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <ConsentCard
                key={request.id}
                request={request}
                onGrant={handleGrant}
                onDeny={handleDeny}
                onRevoke={handleRevoke}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No consent requests found</Text>
              <Text style={styles.emptyStateSubtext}>
                Doctor requests will appear here when they need access to your records
              </Text>
            </View>
          )}
        </View>
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
  requestsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    ...Typography.subtitle,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    ...Typography.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});