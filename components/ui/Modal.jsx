import React from 'react';
import { View, Modal as RNModal, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
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
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, style]}>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
          >
            <X size={20} color="#000" />
          </TouchableOpacity>
          
          {children}
        </View>
      </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  }
});

export default Modal; 