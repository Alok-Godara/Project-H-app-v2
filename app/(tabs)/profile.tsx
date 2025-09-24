import ProfileCard from '@/components/ProfileCard';
import ProfileField from '@/components/ProfileField';
import { Colors } from '@/constants/Colors';
import { mockPatientProfile } from '@/data/mockData';
import authService from '@/Services/AuthService';
import { PatientProfile } from '@/types/medical';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<PatientProfile>(mockPatientProfile);
  const router = useRouter();

  const updatePersonalInfo = (field: keyof PatientProfile['personalInfo'], value: string) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // const updateHealthInfo = (field: keyof PatientProfile['healthInfo'], value: string) => {
  //   setProfile(prev => ({
  //     ...prev,
  //     healthInfo: {
  //       ...prev.healthInfo,
  //       [field]: value,
  //     },
  //   }));
  // };

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileCard title="Personal Information">
          <ProfileField
            label="Full Name"
            value={profile.personalInfo.name}
            onSave={(value) => updatePersonalInfo('name', value)}
          />
          <ProfileField
            label="Email Address"
            value={profile.personalInfo.email}
            onSave={(value) => updatePersonalInfo('email', value)}
          />
          <ProfileField
            label="Phone Number"
            value={profile.personalInfo.phone}
            onSave={(value) => updatePersonalInfo('phone', value)}
          />
        </ProfileCard>
      </ScrollView>
      <View style={styles.signoutContainer}>
        <TouchableOpacity style={styles.signoutButton} onPress={handleSignOut}>
          <Image source={require('@/assets/images/icon.png')} style={styles.signoutLogo} />
          <Text style={styles.signoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  signoutContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  signoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f', // Red color
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  signoutLogo: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  signoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});