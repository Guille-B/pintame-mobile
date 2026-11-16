import { Image, StyleSheet, Text, View } from 'react-native';
import type {
  LocalPhoto,
  OptimizationComparison,
} from '@/features/media/media.types';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';

function formatBytes(bytes?: number | null): string {
  if (bytes === undefined || bytes === null) return 'Calculando...';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB (${bytes.toLocaleString('es-AR')} B)`;
  return `${(kb / 1024).toFixed(2)} MB (${bytes.toLocaleString('es-AR')} B)`;
}

type Props = {
  photo: LocalPhoto;
  comparison?: OptimizationComparison | null;
};

export function PhotoPreview({ photo, comparison }: Props) {
  const sourceLabel =
    photo.source === 'camera'
      ? 'Cámara del dispositivo'
      : photo.source === 'library'
      ? 'Galería de imágenes'
      : 'Cámara de mostrador';

  return (
    <Card style={styles.container}>
      <Image
        source={{ uri: comparison ? comparison.optimizedPhoto.uri : photo.uri }}
        style={styles.photo}
        resizeMode="contain"
      />
      <Text style={styles.metaTitle}>Detalles técnicos de la imagen</Text>
      <Text style={styles.metaLine}>Origen: {sourceLabel}</Text>
      <Text style={styles.metaLine}>
        Resolución original: {photo.width} × {photo.height}px
      </Text>
      <Text style={styles.metaLine}>
        Peso del archivo: {formatBytes(comparison?.beforeBytes ?? photo.fileSize)}
      </Text>
      {photo.fileName ? (
        <Text style={styles.metaLine}>Nombre: {photo.fileName}</Text>
      ) : null}
      {photo.mimeType ? (
        <Text style={styles.metaLine}>Formato: {photo.mimeType}</Text>
      ) : null}

      {comparison ? (
        <View style={styles.optimizedBox}>
          <Text style={styles.optimizedTitle}>
            Imagen optimizada para catálogo (JPEG máx. 1024px)
          </Text>
          <Text style={styles.optimizedText}>
            Nueva resolución: {comparison.optimizedPhoto.width} ×{' '}
            {comparison.optimizedPhoto.height}px
          </Text>
          <Text style={styles.optimizedText}>
            Peso inicial: {formatBytes(comparison.beforeBytes)}
          </Text>
          <Text style={styles.optimizedText}>
            Peso optimizado: {formatBytes(comparison.afterBytes)}
          </Text>
          {comparison.reductionPercent !== null ? (
            <Text style={styles.reductionBadge}>
              Ahorro de almacenamiento: {comparison.reductionPercent.toFixed(1)}%
            </Text>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  photo: {
    width: '100%',
    height: 260,
    backgroundColor: '#EAF5FC',
    borderRadius: theme.radius.md,
    marginBottom: 6,
  },
  metaTitle: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  metaLine: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  optimizedBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.successBg,
    borderWidth: 1,
    borderColor: theme.colors.success,
    gap: 2,
  },
  optimizedTitle: {
    fontSize: theme.typography.small,
    fontWeight: '800',
    color: theme.colors.success,
  },
  optimizedText: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
  },
  reductionBadge: {
    fontSize: theme.typography.body,
    fontWeight: '900',
    color: theme.colors.success,
    marginTop: 4,
  },
});
