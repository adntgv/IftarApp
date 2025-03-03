import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SendHorizonal, ArrowLeft } from 'lucide-react-native';
import useAuthStore from '../../hooks/useAuth';

// UI Components
import { Button, Input } from '../../components/ui';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { resetPassword, error, isLoading, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  
  // Handle reset password
  const handleResetPassword = async () => {
    // Clear previous errors and messages
    clearError();
    setValidationError('');
    setMessage('');
    
    // Validate inputs
    if (!email) {
      setValidationError('Please enter your email address');
      return;
    }
    
    try {
      await resetPassword(email);
      setMessage('Password reset instructions sent to your email');
      setEmail('');
    } catch (err) {
      console.error('Reset password failed:', err);
      // Error is already set in the store
    }
  };
  
  // Go back to login
  const goBack = () => {
    router.back();
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Button
            icon={<ArrowLeft size={20} color="#6b7280" />}
            variant="ghost"
            onPress={goBack}
          />
          <Text style={styles.headerTitle}>Reset Password</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <Text style={styles.heading}>Forgot Your Password?</Text>
        <Text style={styles.subheading}>Enter your email address and we'll send you instructions to reset your password</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {validationError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{validationError}</Text>
          </View>
        )}
        
        {message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
        
        <View style={styles.formContainer}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Button
            title="Send Reset Instructions"
            onPress={handleResetPassword}
            variant="primary"
            disabled={isLoading}
            icon={isLoading ? <ActivityIndicator color="#fff" size="small" /> : <SendHorizonal size={20} color="#fff" />}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#ecfdf5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  messageText: {
    color: '#059669',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen; 