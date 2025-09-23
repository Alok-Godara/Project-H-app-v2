import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCard from '@/components/ProfileCard';
import ProfileField from '@/components/ProfileField';
import { mockPatientProfile } from '@/data/mockData';
import { PatientProfile } from '@/types/medical';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<PatientProfile>(mockPatientProfile);

  const updatePersonalInfo = (field: keyof PatientProfile['personalInfo'], value: string) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateHealthInfo = (field: keyof PatientProfile['healthInfo'], value: string) => {
    setProfile(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [field]: value,
      },
    }));
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
          <ProfileField
            label="Address"
            value={profile.personalInfo.address}
            onSave={(value) => updatePersonalInfo('address', value)}
            multiline
          />
        </ProfileCard>

        <ProfileCard title="Health Information">
          <ProfileField
            label="Allergies"
            value={profile.healthInfo.allergies}
            onSave={(value) => updateHealthInfo('allergies', value)}
            multiline
          />
          <ProfileField
            label="Blood Type"
            value={profile.healthInfo.bloodType}
            onSave={(value) => updateHealthInfo('bloodType', value)}
          />
          <ProfileField
            label="Chronic Conditions"
            value={profile.healthInfo.chronicConditions}
            onSave={(value) => updateHealthInfo('chronicConditions', value)}
            multiline
          />
          <ProfileField
            label="Emergency Contact"
            value={profile.healthInfo.emergencyContact}
            onSave={(value) => updateHealthInfo('emergencyContact', value)}
          />
        </ProfileCard>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
});