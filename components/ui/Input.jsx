import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  Animated, 
  Pressable,
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '../ThemeProvider';

/**
 * Enhanced Input component with animations and theming
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'none',
  autoCorrect = false,
  keyboardType = 'default',
  style,
  inputStyle,
  labelStyle,
  leftIcon,
  rightIcon,
  onBlur,
  onFocus,
  maxLength,
  disabled = false,
  required = false,
  helperText,
  textAlignVertical,
  placeholderTextColor,
  variant = 'outlined', // outlined, filled, underlined
  size = 'medium', // small, medium, large
}) => {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  
  // State
  const [isFocused, setIsFocused] = useState(false);
  const [focusAnim] = useState(new Animated.Value(0));
  
  // Animation on focus/blur
  React.useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);
  
  // Size configurations
  const sizeConfig = {
    small: {
      paddingVertical: spacing.spacing.xs,
      paddingHorizontal: spacing.spacing.sm,
      fontSize: typography.fontSize.sm,
    },
    medium: {
      paddingVertical: spacing.spacing.sm,
      paddingHorizontal: spacing.spacing.md,
      fontSize: typography.fontSize.base,
    },
    large: {
      paddingVertical: spacing.spacing.md,
      paddingHorizontal: spacing.spacing.md,
      fontSize: typography.fontSize.lg,
    },
  };
  
  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          container: {
            backgroundColor: isFocused 
              ? colors.backgroundSecondary 
              : colors.backgroundTertiary,
            borderWidth: 0,
            borderRadius: spacing.borderRadius.md,
          },
          input: {
            backgroundColor: 'transparent',
          },
        };
      case 'underlined':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: isFocused 
              ? colors.primary 
              : error 
                ? colors.error 
                : colors.border,
            borderRadius: 0,
          },
          input: {
            backgroundColor: 'transparent',
          },
        };
      case 'outlined':
      default:
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: isFocused 
              ? colors.primary 
              : error 
                ? colors.error 
                : colors.border,
            borderRadius: spacing.borderRadius.md,
          },
          input: {
            backgroundColor: 'transparent',
          },
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  const currentSize = sizeConfig[size];
  
  const borderColor = error 
    ? colors.error 
    : isFocused 
      ? colors.primary 
      : colors.border;
  
  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus && onFocus(e);
  };
  
  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };
  
  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text 
            style={[
              styles.label, 
              {
                color: error 
                  ? colors.error 
                  : isFocused 
                    ? colors.primary 
                    : colors.textSecondary,
                fontSize: typography.fontSize.sm,
                fontFamily: typography.fontFamily.medium,
              },
              labelStyle,
            ]}
          >
            {label} {required && <Text style={{ color: colors.error }}>*</Text>}
          </Text>
        </View>
      )}
      
      <View
        style={[
          styles.container,
          variantStyles.container,
          {
            paddingVertical: multiline ? spacing.spacing.sm : 0,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            variantStyles.input,
            {
              color: disabled ? colors.textTertiary : colors.text,
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: leftIcon || rightIcon ? 0 : currentSize.paddingHorizontal,
              fontSize: currentSize.fontSize,
              fontFamily: typography.fontFamily.regular,
              textAlignVertical: multiline ? 'top' : textAlignVertical,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || colors.textTertiary}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          editable={!disabled}
        />
        
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text 
          style={[
            styles.helperText, 
            {
              color: error ? colors.error : colors.textTertiary,
              fontSize: typography.fontSize.xs,
            }
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    marginBottom: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
  },
  leftIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  rightIcon: {
    paddingRight: 12,
    paddingLeft: 8,
  },
  helperText: {
    marginTop: 4,
  },
});

export default Input; 