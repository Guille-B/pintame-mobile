import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { AppButton } from './AppButton';

type Props = {
  title: string;
  description?: string;
  variant?: 'loading' | 'error' | 'empty' | 'success';
  actionLabel?: string;
  onAction?: () => void;
};

export function FeedbackState({
  title,
  description,
  variant = 'empty',
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={[styles.box, styles[variant]]}>
      {variant === 'loading' ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.spinner}
        />
      ) : null}
      <Text style={[styles.title, variant === 'error' && styles.errorText]}>
        {title}
      </Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          variant={variant === 'error' ? 'danger' : 'primary'}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginVertical: theme.spacing.sm,
  },
  loading: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  error: {
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.dangerBg,
  },
  empty: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  success: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.successBg,
  },
  spinner: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.danger,
  },
  description: {
    fontSize: theme.typography.body,
    color: theme.colors.muted,
    marginTop: 4,
    lineHeight: 20,
  },
});
