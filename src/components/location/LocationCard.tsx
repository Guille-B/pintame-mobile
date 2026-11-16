import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { CurrentLocation } from '@/features/device-location/location.types';
import {
  classifyLocationAccuracy,
  formatMeasurementAge,
} from '@/features/device-location/location.service';
import { theme } from '@/constants/theme';

type Props = {
  location: CurrentLocation;
  title?: string;
};

export function LocationCard({ location, title = 'Medición de ubicación' }: Props) {
  const classification = classifyLocationAccuracy(location.accuracy);

  return (
    <Card>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={[
            styles.badge,
            classification.level === 'buena'
              ? styles.badgeGood
              : classification.level === 'aceptable'
              ? styles.badgeWarn
              : styles.badgeLow,
          ]}
        >
          <Text style={styles.badgeText}>{classification.label}</Text>
        </View>
      </View>

      <Text style={styles.coord}>Lat: {location.latitude.toFixed(6)}</Text>
      <Text style={styles.coord}>Lng: {location.longitude.toFixed(6)}</Text>
      <Text style={styles.meta}>
        Precisión (accuracy):{' '}
        {location.accuracy !== null ? `±${Math.round(location.accuracy)} m` : 'N/D'}
      </Text>
      <Text style={styles.meta}>
        Medición: {new Date(location.timestamp).toLocaleTimeString()} (
        {formatMeasurementAge(location.timestamp)})
      </Text>
      <Text style={styles.helper}>{classification.description}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  badgeGood: {
    backgroundColor: theme.colors.successBg,
  },
  badgeWarn: {
    backgroundColor: theme.colors.warningBg,
  },
  badgeLow: {
    backgroundColor: theme.colors.dangerBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.text,
  },
  coord: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  meta: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    marginTop: 4,
  },
  helper: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginTop: 6,
  },
});
