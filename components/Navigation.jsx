import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Home, Bell, Plus, Calendar, User } from 'lucide-react-native';
import Button from './ui/Button';

/**
 * Navigation component for the bottom tab bar
 */
const Navigation = ({ activeTab, onChangeTab }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Button 
          variant="icon" 
          icon={<Home size={24} color={activeTab === 'home' ? '#3b82f6' : '#6b7280'} />} 
          onPress={() => onChangeTab('home')} 
          style={activeTab === 'home' ? styles.activeTab : {}}
        />
        <Button 
          variant="icon" 
          icon={<Bell size={24} color={activeTab === 'invites' ? '#3b82f6' : '#6b7280'} />} 
          onPress={() => onChangeTab('invites')} 
          style={activeTab === 'invites' ? styles.activeTab : {}}
        />
        <Button 
          variant="primary" 
          icon={<Plus size={24} color="white" />} 
          onPress={() => onChangeTab('create')} 
          style={styles.createButton}
        />
        <Button 
          variant="icon" 
          icon={<Calendar size={24} color={activeTab === 'calendar' ? '#3b82f6' : '#6b7280'} />} 
          onPress={() => onChangeTab('calendar')} 
          style={activeTab === 'calendar' ? styles.activeTab : {}}
        />
        <Button 
          variant="icon" 
          icon={<User size={24} color={activeTab === 'profile' ? '#3b82f6' : '#6b7280'} />} 
          onPress={() => onChangeTab('profile')} 
          style={activeTab === 'profile' ? styles.activeTab : {}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  activeTab: {
    backgroundColor: '#eff6ff',
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Navigation; 