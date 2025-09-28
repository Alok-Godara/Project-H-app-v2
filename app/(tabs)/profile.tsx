import ProfileCard from '@/components/ProfileCard';
import { Colors } from '@/constants/Colors';
import authService from '@/Services/AuthService';
import { getCurrentPatientId, updatePatientProfile } from '@/Services/Services';
import { PatientProfile } from '@/types/medical';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<PatientProfile>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    healthInfo: {
      allergies: '',
      bloodType: '',
      chronicConditions: '',
      emergencyContact: '',
    },
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const router = useRouter();

  // Function to get current logged-in user's patient ID (commented for future use)
  // const getCurrentPatientId = async () => {
  //   try {
  //     const currentUser = await authService.getCurrentUser();
  //     if (currentUser?.user?.id) {
  //       // Assuming user.id maps to patient.id or you have a user_patients mapping table
  //       return currentUser.user.id;
  //     }
  //     return null;
  //   } catch (error) {
  //     console.error('Error getting current user:', error);
  //     return null;
  //   }
  // };

  // Fetch patient data from database
  const fetchPatientProfile = useCallback(async () => {
    setLoading(true);
    try {
      // Get current patient ID from session
      const currentPatientId = await getCurrentPatientId();
      if (!currentPatientId) {
        Alert.alert('Error', 'No authenticated user found');
        setLoading(false);
        return;
      }
      setPatientId(currentPatientId);
      
      const { supabase } = await import('@/Services/Supabase');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', currentPatientId)
        .single();
      
      if (error) {
        console.error('Error fetching patient profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
        return;
      }

      if (data) {
        // Map database fields to profile structure
        const mappedProfile: PatientProfile = {
          personalInfo: {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
          },
          healthInfo: {
            allergies: '', // Can be populated from additional health data
            bloodType: '',
            chronicConditions: '',
            emergencyContact: data.emergency_contact_name || '',
          },
        };
        setProfile(mappedProfile);
        
        // Update form data
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
        
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, []); // Removed patientId dependency as it's fetched inside the function

  // Reload profile data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPatientProfile();
    }, [fetchPatientProfile])
  );

  // Handle form field changes
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Save changes to database
  const handleSave = async () => {
    setSaving(true);
    try {
      if (!patientId) {
        Alert.alert('Error', 'No authenticated user found');
        setSaving(false);
        return;
      }
      const { error } = await updatePatientProfile(patientId, formData);
      
      if (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to save profile changes. Please try again.');
        return;
      }
      
      // Update local profile state
      setProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...formData
        }
      }));
      
      setHasChanges(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setFormData({
      name: profile.personalInfo.name,
      email: profile.personalInfo.email,
      phone: profile.personalInfo.phone,
      address: profile.personalInfo.address,
    });
    setHasChanges(false);
  };

  const handleSignOut = async () => {
    const result = await authService.logoutService();
    if (result) {
      router.replace('/login');
    } else {
      Alert.alert('Sign Out Failed', 'Unable to sign out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            <ProfileCard title="Personal Information">
              <View style={styles.formContainer}>
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.name}
                    onChangeText={(value) => handleFieldChange('name', value)}
                    placeholder="Enter your full name"
                    placeholderTextColor={Colors.text.secondary}
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(value) => handleFieldChange('email', value)}
                    placeholder="Enter your email address"
                    placeholderTextColor={Colors.text.secondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.phone}
                    onChangeText={(value) => handleFieldChange('phone', value)}
                    placeholder="Enter your phone number"
                    placeholderTextColor={Colors.text.secondary}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Address</Text>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    value={formData.address}
                    onChangeText={(value) => handleFieldChange('address', value)}
                    placeholder="Enter your address"
                    placeholderTextColor={Colors.text.secondary}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </ProfileCard>

            {/* Save/Reset buttons - integrated in the same flow */}
            {hasChanges && (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Sign out section - only show when no changes (save button hidden) */}
            {!hasChanges && (
              <View style={styles.signoutSection}>
                <TouchableOpacity style={styles.signoutButton} onPress={handleSignOut}>
                  <View style={styles.signoutContent}>
                    <Text style={styles.signoutText}>Sign Out</Text>
                    <Text style={styles.signoutSubtext}>End current session</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding at bottom for better spacing
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  formContainer: {
    gap: 20,
  },
  fieldContainer: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border || '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border || '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  saveButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  signoutSection: {
    marginTop: 10,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border || '#E0E0E0',
  },
  signoutButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  signoutContent: {
    alignItems: 'center',
  },
  signoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 2,
  },
  signoutSubtext: {
    fontSize: 12,
    color: '#6c757d',
  },
});