import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, Moon, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import useAuthStore from '../../hooks/useAuth';

// UI Components
import { Button, Input } from '../../components/ui';

const SignupScreen = () => {
  const router = useRouter();
  const { register, error, isLoading, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle signup
  const handleSignup = async () => {
    // Clear previous errors
    clearError();
    setValidationError('');
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      await register(email, password, name);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Sign up failed:', err);
      // Error is already set in the store
    }
  };
  
  // Navigate to login
  const goToLogin = () => {
    router.push('/(auth)/login');
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Moon size={60} color="#3b82f6" />
          <Text style={styles.logoText}>Iftar App</Text>
        </View>
        
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Join the community to plan and share Iftar events</Text>
        
        {(error || validationError) && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error || validationError}</Text>
          </View>
        )}
        
        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />
          
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.passwordContainer}>
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              rightIcon={
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              }
            />
          </View>
          
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
          
          <Button
            title="Sign Up"
            onPress={handleSignup}
            variant="primary"
            disabled={isLoading}
            icon={isLoading ? <ActivityIndicator color="#fff" size="small" /> : <UserPlus size={20} color="#fff" />}
          />
        </View>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.loginLink}>Back To Events</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
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
  passwordContainer: {
    marginBottom: 10,
  },
  termsContainer: {
    marginVertical: 20,
  },
  termsText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  termsLink: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
    marginRight: 5,
  },
  loginLink: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
});

export default SignupScreen; 