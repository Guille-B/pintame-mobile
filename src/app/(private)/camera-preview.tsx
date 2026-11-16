import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import {
  compareAndOptimizePhoto,
  fileSizeInBytes,
} from '@/features/media/image.service';
import type { OptimizationComparison } from '@/features/media/media.types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PermissionState } from '@/components/media/PermissionState';
import { theme } from '@/constants/theme';

export default function CameraPreviewScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoDims, setPhotoDims] = useState<{ width: number; height: number } | null>(
    null
  );
  const [comparison, setComparison] = useState<OptimizationComparison | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function capture() {
    if (!ready || busy || !cameraRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      if (result?.uri) {
        setPhotoUri(result.uri);
        setPhotoDims({ width: result.width, height: result.height });
        setComparison(null);
      }
    } catch {
      setError('No se pudo capturar la fotografía.');
    } finally {
      setBusy(false);
    }
  }

  function toggleFacing() {
    setReady(false);
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }

  async function handleOptimize() {
    if (!photoUri || busy) return;
    setBusy(true);
    try {
      const before = fileSizeInBytes(photoUri) ?? undefined;
      const comp = await compareAndOptimizePhoto(photoUri, before);
      setComparison(comp);
    } catch {
      setError('No se pudo optimizar la imagen capturada.');
    } finally {
      setBusy(false);
    }
  }

  function handleRepeat() {
    setReady(false);
    setPhotoUri(null);
    setPhotoDims(null);
    setComparison(null);
    setError(null);
  }

  if (!permission) {
    return (
      <Screen>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.centered}
        />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <PermissionState
          title="Acceso a Cámara de Mostrador"
          description="Habilitá el acceso a la cámara para encuadrar y fotografiar muestras de color, etiquetas de lote y envases."
          onRequest={requestPermission}
        />
      </Screen>
    );
  }

  if (photoUri) {
    return (
      <Screen>
        <SectionHeader
          title="Revisión de Fotografía"
          subtitle="Verificá la nitidez de la muestra antes de optimizarla o tomar otra captura"
        />

        <Card>
          <Image
            source={{
              uri: comparison ? comparison.optimizedPhoto.uri : photoUri,
            }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          {photoDims ? (
            <Text style={styles.metaText}>
              Resolución original: {photoDims.width} × {photoDims.height}px ·
              Cámara de mostrador
            </Text>
          ) : null}

          {comparison ? (
            <Text style={styles.optimizedNotice}>
              Versión optimizada (JPEG): {comparison.optimizedPhoto.width} ×{' '}
              {comparison.optimizedPhoto.height}px
              {comparison.reductionPercent !== null
                ? ` · Ahorro: ${comparison.reductionPercent.toFixed(1)}%`
                : ''}
            </Text>
          ) : null}
        </Card>

        <AppButton
          title="Repetir fotografía"
          onPress={handleRepeat}
          disabled={busy}
        />
        <AppButton
          title="Optimizar para catálogo (JPEG máx. 1024px)"
          variant="secondary"
          onPress={handleOptimize}
          disabled={busy}
        />
        <AppButton
          title="Descartar captura"
          variant="danger"
          onPress={handleRepeat}
          disabled={busy}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <SectionHeader
        title="Cámara de Mostrador"
        subtitle={`${
          ready ? 'Sensor listo para capturar' : 'Inicializando cámara...'
        } · Lente ${facing === 'back' ? 'trasera' : 'frontal'}`}
      />

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={() => setReady(true)}
        />
        <View style={styles.frameOverlay} pointerEvents="none">
          <Text style={styles.frameLabel}>
            Centrá el envase, código de lote o muestra de color
          </Text>
        </View>
      </View>

      {busy ? (
        <View style={styles.busyRow}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.busyText}>Procesando captura...</Text>
        </View>
      ) : null}

      {error ? (
        <FeedbackState
          variant="error"
          title="Error de captura"
          description={error}
        />
      ) : null}

      <AppButton
        title={busy ? 'Capturando…' : 'Tomar fotografía'}
        onPress={capture}
        disabled={!ready || busy}
      />

      <AppButton
        title={`Cambiar a cámara ${facing === 'back' ? 'frontal' : 'trasera'}`}
        variant="outline"
        onPress={toggleFacing}
        disabled={busy}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    minHeight: 320,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  frameOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  frameLabel: {
    color: 'white',
    fontSize: theme.typography.small,
    fontWeight: '700',
  },
  busyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4,
  },
  busyText: {
    fontSize: theme.typography.small,
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
  },
  metaText: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginTop: 8,
  },
  optimizedNotice: {
    fontSize: theme.typography.small,
    color: theme.colors.success,
    fontWeight: '800',
    marginTop: 6,
  },
});
