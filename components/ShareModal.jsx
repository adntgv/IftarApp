import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, SafeAreaView, Share } from 'react-native';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react-native';
import Modal from './ui/Modal';
import Button from './ui/Button';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from './ThemeProvider';

/**
 * ShareModal component for sharing event links
 */
const ShareModal = ({ 
  isOpen, 
  isVisible,
  onClose, 
  event,
  shareLink,
  onPreviewPublic
}) => {
  const isModalVisible = isVisible !== undefined ? isVisible : isOpen;
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;
  
  const [copied, setCopied] = useState(false);
  
  // Reset copied status after 2 seconds
  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!event) return null;

  // Handle native share
  const handleNativeShare = async () => {
    try {
      await Share.share({
        message: `Join me for Iftar: ${event.title} on ${event.date} at ${event.location}. ${shareLink}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the event');
    }
    onClose();
  };

  // Handle copy link
  const handleCopyLink = async () => {
    try {
      await Clipboard.setStringAsync(shareLink);
      setCopied(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  // Handle preview public view
  const handlePreviewPublic = () => {
    if (onPreviewPublic) {
      onPreviewPublic(event);
      onClose();
    }
  };

  return (
    <Modal isVisible={isModalVisible} onClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Share2 size={28} color="#3b82f6" />
          </View>
          
          <Text style={styles.title}>Share this Iftar event</Text>
          <Text style={styles.description}>
            Invite friends and family to join you for this iftar gathering
          </Text>
          
          <View style={styles.linkContainer}>
            <Text style={styles.linkLabel}>Event Link:</Text>
            <View style={styles.linkRow}>
              <TextInput
                style={styles.linkInput}
                value={shareLink}
                editable={false}
                selectTextOnFocus
              />
              <TouchableOpacity
                style={[styles.copyButton, copied ? styles.copyButtonSuccess : {}]}
                onPress={handleCopyLink}
              >
                {copied ? (
                  <Check size={18} color="#ffffff" />
                ) : (
                  <Copy size={18} color="#ffffff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              variant="secondary"
              icon={<Share2 size={18} color="#6b7280" />}
              onPress={handleNativeShare}
              style={styles.actionButton}
            >
              Share with Friends
            </Button>
            
            <Button
              variant="primary"
              icon={<ExternalLink size={18} color="white" />}
              onPress={handlePreviewPublic}
              style={styles.actionButton}
            >
              Preview Public View
            </Button>
          </View>
          
          <Text style={styles.hint}>
            {copied ? '✓ Link copied to clipboard!' : 'Tap to copy the link or share directly'}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  linkContainer: {
    width: '100%',
    marginBottom: 24,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: Platform.OS === 'ios' ? 12 : 10,
    color: '#4b5563',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    fontSize: 14,
  },
  copyButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonSuccess: {
    backgroundColor: '#10b981',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.48,
  },
  hint: {
    fontSize: 12,
    color:  '#6b7280',
    textAlign: 'center',
  },
});

export default ShareModal; 