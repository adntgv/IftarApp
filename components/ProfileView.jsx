import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import { User } from 'lucide-react-native';
import Button from './ui/Button';
import { createShadow } from '../utils/styles';
import { useLocale, LOCALES } from '../context/LocaleContext';
import { translate } from '../utils/translations';

/**
 * ProfileView component for user profile
 */
const ProfileView = ({ 
  onSignOut, 
  userData = null, 
  accountData = null, 
  refreshing = false, 
  onRefresh = () => {} 
}) => {
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const timeoutRef = useRef(null);
  const { locale, changeLocale } = useLocale();
  
  // Debug log when props change
  useEffect(() => {
    console.log('ProfileView props updated:', { 
      hasUserData: !!userData, 
      hasAccountData: !!accountData,
      refreshing 
    });
  }, [userData, accountData, refreshing]);
  
  // Set a timeout for loading to prevent infinite spinner
  useEffect(() => {
    // Clear any existing timeout first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Only set timeout if we're in a loading state
    if (!userData && !accountData && !refreshing) {
      console.log('Setting loading timeout');
      timeoutRef.current = setTimeout(() => {
        console.log('Loading timeout triggered');
        setLoadingTimeout(true);
      }, 10000); // 10 seconds timeout
    } else {
      // If we have data or are refreshing, reset timeout flag
      setLoadingTimeout(false);
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [userData, accountData, refreshing]);
  
  // Determine what to render
  if (refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Refreshing profile...</Text>
      </View>
    );
  }
  
  if (!userData && !accountData) {
    if (loadingTimeout) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Could not load profile</Text>
          <Text style={styles.errorSubtext}>There was a problem connecting to the server</Text>
          <Button 
            variant="primary"
            onPress={() => {
              setLoadingTimeout(false);
              onRefresh();
            }}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      );
    }
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // If we got here, we have data to display
  // Extracting user information from userData and accountData
  const name = userData?.name || accountData?.name || 'User';
  const email = userData?.email || accountData?.email || '';
  const userId = userData?.userId || accountData?.$id || '';
  
  // Default stats if not available
  const stats = {
    hosted: userData?.hostedEventsCount || 0,
    invites: userData?.invitationsCount || 0
  };
  
  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translate(locale, 'profile.language')}</Text>
          <View style={styles.languageOptions}>
            <Button
              variant={locale === LOCALES.ENGLISH ? 'primary' : 'secondary'}
              onPress={() => {
                changeLocale(LOCALES.ENGLISH);
                setShowLanguageModal(false);
              }}
              style={styles.languageButton}
            >
              English
            </Button>
            <Button
              variant={locale === LOCALES.KAZAKH ? 'primary' : 'secondary'}
              onPress={() => {
                changeLocale(LOCALES.KAZAKH);
                setShowLanguageModal(false);
              }}
              style={styles.languageButton}
            >
              Қазақша
            </Button>
            <Button
              variant={locale === LOCALES.RUSSIAN ? 'primary' : 'secondary'}
              onPress={() => {
                changeLocale(LOCALES.RUSSIAN);
                setShowLanguageModal(false);
              }}
              style={styles.languageButton}
            >
              Русский
            </Button>
          </View>
          <Button
            variant="secondary"
            onPress={() => setShowLanguageModal(false)}
            style={styles.closeButton}
          >
            {translate(locale, 'common.cancel')}
          </Button>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={['#3b82f6']}
          tintColor="#3b82f6"
        />
      }
    >
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

        {/* <View style={styles.accountInfoContainer}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.accountInfoCard}>
            <Text style={styles.accountInfoLabel}>User ID</Text>
            <Text style={styles.accountInfoValue}>{userId || 'Not available'}</Text>
          </View>
        </View> */}
        
        <View style={styles.preferencesContainer}>
          <Text style={styles.sectionTitle}>{translate(locale, 'profile.preferences')}</Text>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>{translate(locale, 'profile.language')}</Text>
            <Button 
              variant="ghost"
              onPress={() => setShowLanguageModal(true)}
              style={styles.editButton}
            >
              {translate(locale, 'common.edit')}
            </Button>
          </View>
        </View>
        
        <Button 
          variant="secondary"
          onPress={onSignOut}
          fullWidth
          style={styles.signOutButton}
        >
          {translate(locale, 'auth.signOut')}
        </Button>
      </View>
      {renderLanguageModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  errorSubtext: {
    marginBottom: 24,
    fontSize: 16,
    color: '#6b7280',
  },
  retryButton: {
    marginTop: 8,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    ...createShadow({
      opacity: 0.1,
      radius: 4,
      offsetY: 2,
      elevation: 2
    }),
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
  accountInfoContainer: {
    width: '100%',
    marginBottom: 24,
  },
  accountInfoCard: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    marginBottom: 8,
  },
  accountInfoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  accountInfoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  preferencesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#374151',
  },
  signOutButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOptions: {
    gap: 12,
    marginBottom: 20,
  },
  languageButton: {
    width: '100%',
  },
  closeButton: {
    marginTop: 12,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default ProfileView; 