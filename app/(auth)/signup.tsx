import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import authService from "@/Services/AuthService"

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    await authService.createAccountService(formData);

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/upload') }
      ]);

    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us to manage your medical records securely</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User color={Colors.text.tertiary} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.name}
                  onChangeText={(value) => updateField('name', value)}
                  autoComplete="name"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail color={Colors.text.tertiary} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Phone color={Colors.text.tertiary} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.phone}
                  onChangeText={(value) => updateField('phone', value)}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock color={Colors.text.tertiary} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff color={Colors.text.tertiary} size={20} />
                  ) : (
                    <Eye color={Colors.text.tertiary} size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock color={Colors.text.tertiary} size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor={Colors.text.tertiary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff color={Colors.text.tertiary} size={20} />
                  ) : (
                    <Eye color={Colors.text.tertiary} size={20} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    ...Typography.title,
    fontSize: 28,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text.primary,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
  },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
  },
});