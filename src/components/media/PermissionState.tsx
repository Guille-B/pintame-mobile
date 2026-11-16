import { StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { theme } from '@/constants/theme';

type Props = {
  title: string;
  description: string;
  onRequest: () => void;
};

export function PermissionState({ title, description, onRequest }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <AppButton title="Solicitar permiso" onPress={onRequest} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    marginBottom: 6,
  },
  description: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    lineHeight: 21,
    marginBottom: 8,
  },
});
