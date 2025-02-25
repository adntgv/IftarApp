import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Copy, Share2, ExternalLink } from 'lucide-react-native';
import Modal from './ui/Modal';
import Button from './ui/Button';
import * as Clipboard from 'expo-clipboard';

/**
 * ShareModal component for sharing event links
 */
const ShareModal = ({ 
  event, 
  isOpen, 
  onClose, 
  onPreviewPublic 
}) => {
  const [linkCopied, setLinkCopied] = useState(false);
  
  const shareLink = event ? `https://iftar-app.example.com/event/${event.shareCode}` : '';
  
  // Reset copy status after 2 seconds
  useEffect(() => {
    if (linkCopied) {
      const timer = setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [linkCopied]);

  // Handle copy link to clipboard
  const handleCopyLink = async () => {
    if (shareLink) {
      try {
        await Clipboard.setStringAsync(shareLink);
        setLinkCopied(true);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };
  
  if (!event) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Share this Event</Text>
        
        <Text style={styles.description}>
          Anyone with this link can view the event details. 
          {event.isPublic ? ' They can also RSVP after logging in.' : ''}
        </Text>
        
        <View style={styles.linkContainer}>
          <TextInput
            value={shareLink}
            editable={false}
            style={styles.linkInput}
          />
          <Button 
            variant="secondary"
            icon={<Copy size={16} color={linkCopied ? '#16a34a' : '#6b7280'} />}
            onPress={handleCopyLink}
            style={linkCopied ? styles.copyButtonSuccess : styles.copyButton}
          >
            {linkCopied ? 'Copied!' : 'Copy'}
          </Button>
        </View>
        
        <Text style={styles.infoText}>
          People who receive this link will need to log in to respond to the invitation.
        </Text>
        
        <View style={styles.actionButtons}>
          <Button 
            variant="secondary"
            icon={<Share2 size={16} color="#6b7280" />}
            onPress={() => {
              // Here you would implement native sharing
              // Like using Share.share() from react-native
            }}
            style={styles.shareButton}
          >
            Share via Message
          </Button>
          <Button 
            variant="primary"
            icon={<ExternalLink size={16} color="white" />}
            onPress={() => {
              onPreviewPublic?.(event);
              onClose();
            }}
            style={styles.previewButton}
          >
            Preview Public View
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
  },
  description: {
    color: '#4b5563',
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  linkInput: {
    flex: 1,
    color: '#4b5563',
    paddingVertical: 10,
    fontSize: 14,
  },
  copyButton: {
    marginLeft: 8,
  },
  copyButtonSuccess: {
    marginLeft: 8,
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareButton: {
    flex: 0.48,
  },
  previewButton: {
    flex: 0.48,
  },
});

export default ShareModal; 