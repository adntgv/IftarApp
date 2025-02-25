import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogIn } from 'lucide-react-native';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

/**
 * LoginModal component for user authentication
 */
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = () => {
    onLogin?.(credentials);
    // Reset form
    setCredentials({ email: '', password: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        
        <Text style={styles.description}>
          Please sign in to respond to invitations
        </Text>
        
        <Input
          label="Email"
          type="email"
          value={credentials.email}
          onChangeText={(text) => setCredentials({...credentials, email: text})}
          placeholder="your@email.com"
          required
        />
        
        <Input
          label="Password"
          type="password"
          value={credentials.password}
          onChangeText={(text) => setCredentials({...credentials, password: text})}
          placeholder="••••••••"
          required
        />
        
        <Button 
          variant="primary"
          icon={<LogIn size={18} color="white" />}
          onPress={handleLogin}
          fullWidth
          style={styles.signInButton}
        >
          Sign In
        </Button>
        
        <View style={styles.forgotPasswordContainer}>
          <Button variant="link" onPress={() => {}}>
            Forgot Password?
          </Button>
        </View>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <Button 
            variant="secondary" 
            onPress={() => {}} 
            fullWidth
            style={styles.createAccountButton}
          >
            Create Account
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: '#4b5563',
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
  },
  signInButton: {
    marginTop: 8,
  },
  forgotPasswordContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  signupText: {
    color: '#4b5563',
    marginBottom: 8,
  },
  createAccountButton: {
    marginTop: 8,
  },
});

export default LoginModal; 