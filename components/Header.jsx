import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Moon } from 'lucide-react-native';
import Button from './ui/Button';

/**
 * Header component for the top bar of the app
 */
const Header = ({ title, action, actionLabel }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Moon size={24} color="#3b82f6" style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        {action && (
          <Button 
            variant="link" 
            onPress={action}
          >
            {actionLabel || 'List View'}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});

export default Header; 