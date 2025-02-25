import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { Mail, Lock, Eye, EyeOff, Moon } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';

/**
 * Login Modal component with enhanced styling
 */
const LoginModal = ({ isVisible, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const handleLogin = () => {
    // Form validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin(email, password);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal 
      isVisible={isVisible} 
      onClose={onClose}
      title="Welcome Back"
      position="center"
      backdropOpacity={0.7}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primaryLighter }]}>
            <Moon size={48} color={colors.primary} />
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue to your account
          </Text>
        </View>
        
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.error + '15' }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}
        
        <Input
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={20} color={colors.icon} />}
          error={error && !email.trim() ? 'Email is required' : ''}
          variant="outlined"
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          leftIcon={<Lock size={20} color={colors.icon} />}
          rightIcon={
            <TouchableOpacity onPress={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOff size={20} color={colors.icon} />
              ) : (
                <Eye size={20} color={colors.icon} />
              )}
            </TouchableOpacity>
          }
          error={error && !password.trim() ? 'Password is required' : ''}
          variant="outlined"
        />
        
        <Button
          title={loading ? "Signing in..." : "Sign In"}
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          fullWidth
          style={styles.loginButton}
          elevation="sm"
        />
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity>
            <Text style={[styles.signUpText, { color: colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    marginRight: 4,
  },
  signUpText: {
    fontWeight: '600',
  },
});

export default LoginModal; 