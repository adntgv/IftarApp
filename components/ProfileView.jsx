import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { User } from 'lucide-react-native';
import Button from './ui/Button';
import { userInfo } from '../utils/mockData';

/**
 * ProfileView component for user profile
 */
const ProfileView = ({ onSignOut }) => {
  const { name, email, stats } = userInfo;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <User size={32} color="#3b82f6" />
        </View>
        
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
              <Text style={styles.statLabel}>Hosted Events</Text>
              <Text style={styles.statValue}>{stats.hosted}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#ecfdf5' }]}>
              <Text style={styles.statLabel}>Invitations</Text>
              <Text style={styles.statValue}>{stats.invites}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.preferencesContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Notification Settings</Text>
            <Button variant="link">Edit</Button>
          </View>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Theme Options</Text>
            <Button variant="link">Edit</Button>
          </View>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Language</Text>
            <Button variant="link">Edit</Button>
          </View>
        </View>
        
        <Button 
          variant="secondary"
          onPress={onSignOut}
          fullWidth
          style={styles.signOutButton}
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'left',
    width: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  preferencesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  signOutButton: {
    marginTop: 8,
  },
});

export default ProfileView; 