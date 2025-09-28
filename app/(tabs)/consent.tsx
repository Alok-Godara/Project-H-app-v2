import ConsentCard from '@/components/ConsentCard';
import FilterButton from '@/components/FilterButton';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { getProviderAccessRequests, updateProviderAccessStatus } from '@/Services/Services';
import { ConsentRequest } from '@/types/medical';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConsentScreen() {
  const [requests, setRequests] = useState<ConsentRequest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'allowed' | 'denied' | 'revoked'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Hardcoded patient ID - this should come from authentication
  const patientId = 'a2b46eeb-b0d1-4e57-955f-ccf76143b2a1';

  useEffect(() => {
    loadConsentRequests();
  }, []);

  const loadConsentRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProviderAccessRequests(patientId);
      
      if (error) {
        console.error('Error fetching consent requests:', error);
        Alert.alert('Error', 'Failed to load consent requests');
        return;
      }

      if (data) {
        setRequests(data);
      }
    } catch (error) {
      console.error('Error loading consent requests:', error);
      Alert.alert('Error', 'Failed to load consent requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredRequests = requests.filter(request => 
    selectedFilter === 'all' || request.status === selectedFilter
  );

  const handleFilter = () => {
    setRefreshing(true);
    loadConsentRequests();
  };

  const handleGrant = async (id: string) => {
    try {
      const { data, error } = await updateProviderAccessStatus(id, 'allowed');
      
      if (error) {
        console.error('Error granting access:', error);
        Alert.alert('Error', 'Failed to grant access');
        return;
      }

      if (data) {
        setRequests(prev => prev.map(req => 
          req.id === id ? data : req
        ));
        Alert.alert('Access Granted', 'Provider can now access your medical records.');
      }
    } catch (error) {
      console.error('Error granting access:', error);
      Alert.alert('Error', 'Failed to grant access');
    }
  };

  const handleDeny = async (id: string) => {
    try {
      const { data, error } = await updateProviderAccessStatus(id, 'denied');
      
      if (error) {
        console.error('Error denying access:', error);
        Alert.alert('Error', 'Failed to deny access');
        return;
      }

      if (data) {
        setRequests(prev => prev.map(req => 
          req.id === id ? data : req
        ));
        Alert.alert('Access Denied', 'Provider\'s request has been denied.');
      }
    } catch (error) {
      console.error('Error denying access:', error);
      Alert.alert('Error', 'Failed to deny access');
    }
  };

  const handleRevoke = (id: string) => {
    // Find the provider name for the warning
    const request = requests.find(req => req.id === id);
    const providerName = request?.providers?.name || 'this provider';

    Alert.alert(
      'Revoke Access',
      `Are you sure you want to revoke ${providerName}'s access to your medical records? This action will immediately prevent them from viewing your data.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Revoke Access',
          style: 'destructive',
          onPress: () => performRevoke(id),
        },
      ]
    );
  };

  const performRevoke = async (id: string) => {
    try {
      const { data, error } = await updateProviderAccessStatus(id, 'revoked');
      
      if (error) {
        console.error('Error revoking access:', error);
        Alert.alert('Error', 'Failed to revoke access');
        return;
      }

      if (data) {
        setRequests(prev => prev.map(req => 
          req.id === id ? data : req
        ));
        Alert.alert('Access Revoked', 'Provider\'s access has been revoked successfully.');
      }
    } catch (error) {
      console.error('Error revoking access:', error);
      Alert.alert('Error', 'Failed to revoke access');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consent Management</Text>
        <FilterButton onPress={handleFilter} />
      </View>

      {/* <View style={styles.filterTabs}>
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
          style={[styles.filterTab, selectedFilter === 'allowed' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('allowed')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'allowed' && styles.activeFilterTabText]}>
            Allowed
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
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'revoked' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('revoked')}
        >
          <Text style={[styles.filterTabText, selectedFilter === 'revoked' && styles.activeFilterTabText]}>
            Revoked
          </Text>
        </TouchableOpacity>
      </View> */}

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleFilter}
            colors={[Colors.primary]}
          />
        }
      >
        <View style={styles.requestsContainer}>
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading consent requests...</Text>
            </View>
          ) : filteredRequests.length > 0 ? (
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
                Provider requests will appear here when they need access to your records
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
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginTop: 16,
  },
});