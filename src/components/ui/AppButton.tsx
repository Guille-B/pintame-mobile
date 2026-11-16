import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  disabled,
  variant = 'primary',
  style,
}: Props) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xs,
  },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  danger: { backgroundColor: theme.colors.danger },
  outline: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
  text: {
    color: 'white',
    fontWeight: '800',
    fontSize: theme.typography.body,
  },
  outlineText: {
    color: theme.colors.primary,
  },
});
