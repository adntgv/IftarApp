import React from 'react';
import { View, Modal as RNModal, TouchableOpacity, Dimensions, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import { X } from 'lucide-react-native';

/**
 * A reusable Modal component
 */
const Modal = ({ isOpen, onClose, children, style = {} }) => {
  if (!isOpen) return null;
  
  return (
    <RNModal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['portrait', 'landscape']}
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={[styles.modalContent, style]}>
              <TouchableOpacity 
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                activeOpacity={0.7}
              >
                <X size={20} color="#000" />
              </TouchableOpacity>
              
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      }
    }),
    overflow: 'hidden', // Ensure content doesn't overflow on iOS
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 999, // Higher z-index to ensure it's clickable on iOS
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      }
    }),
  }
});

export default Modal; 