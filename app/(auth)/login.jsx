import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, Moon, Eye, EyeOff } from 'lucide-react-native';
import useAuthStore from '../../hooks/useAuth';

// UI Components
import { Button, Input } from '../../components/ui';

const LoginScreen = () => {
  const router = useRouter();
  const { login, error, isLoading, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle login
  const handleLogin = async () => {
    // Clear previous errors
    clearError();
    setValidationError('');
    
    // Validate inputs
    if (!email || !password) {
      setValidationError('Please fill in all fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }
    
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Login failed:', err);
      // Error is already set in the store
    }
  };
  
  // Navigate to signup
  const goToSignup = () => {
    router.push('/(auth)/signup');
  };
  
  // Navigate to forgot password
  const goToForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
        
        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Sign in to continue planning your Iftar events</Text>
        
        {(error || validationError) && (
          <View style={styles.errorContainer}><Text style={styles.errorText}>{error || validationError}</Text></View>
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
          
          <View style={styles.passwordContainer}>
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              rightIcon={
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                </TouchableOpacity>
              }
            />
          </View>
          
          <TouchableOpacity onPress={goToForgotPassword} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            disabled={isLoading}
            icon={isLoading ? <ActivityIndicator color="#fff" size="small" /> : <LogIn size={20} color="#fff" />}
          />
        </View>
        
        <View style={styles.signupContainer}><Text style={styles.signupText}>Don't have an account?</Text>
          <Button
            variant="link"
            title="Sign up"
            onPress={goToSignup}
            style={styles.signupButton}
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#6b7280',
    fontSize: 14,
    marginRight: 5,
  },
  signupButton: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  passwordContainer: {
    marginBottom: 10,
  },
});

export default LoginScreen; 