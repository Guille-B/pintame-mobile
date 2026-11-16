import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSession } from '@/features/auth/useSession';
import { useQrScanner } from '@/features/qr/useQrScanner';
import {
  validatePintameQr,
  ValidateQrResponse,
} from '@/features/qr/qr-product.service';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PermissionState } from '@/components/media/PermissionState';
import { theme } from '@/constants/theme';

export default function QrScannerScreen() {
  const { token } = useSession();
  const [permission, requestPermission] = useCameraPermissions();
  const { value, enabled, onScanned, reset } = useQrScanner();
  const [validation, setValidation] = useState<ValidateQrResponse | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!value) {
      setValidation(null);
      return;
    }
    setValidating(true);
    validatePintameQr(value, token)
      .then(setValidation)
      .finally(() => setValidating(false));
  }, [value, token]);

  if (!permission) {
    return (
      <Screen>
        <Text style={styles.text}>Verificando acceso a la cámara...</Text>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <PermissionState
          title="Acceso a cámara para Lector QR"
          description="Habilitá la cámara para escanear códigos QR de envases de pintura y comprobantes de venta en mostrador."
          onRequest={requestPermission}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Lector QR de Sucursal"
        subtitle="Escaneá la etiqueta de un envase o el código de un comprobante de venta"
      />

      {enabled ? (
        <View style={styles.cameraBox}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={(result) => onScanned(result.data)}
          />
        </View>
      ) : (
        <Card style={styles.pausedBanner}>
          <Text style={styles.resultTitle}>Código capturado correctamente</Text>
          <Text style={styles.resultText}>
            Revisá los datos identificados a continuación o presioná "Escanear
            otro código" para realizar una nueva lectura.
          </Text>
        </Card>
      )}

      {value ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Código detectado</Text>
          <Text style={styles.resultText}>{value}</Text>

          {validating ? (
            <Text style={styles.resultText}>Consultando registro en Píntame...</Text>
          ) : validation ? (
            <View style={styles.validationBox}>
              <Text
                style={[
                  styles.validationStatus,
                  validation.valid ? styles.validOk : styles.validErr,
                ]}
              >
                {validation.message}
              </Text>
              {validation.title ? (
                <Text style={styles.validationTitle}>{validation.title}</Text>
              ) : null}
              {validation.subtitle ? (
                <Text style={styles.resultText}>{validation.subtitle}</Text>
              ) : null}

              {validation.action === 'OPEN_PRODUCT' && validation.targetId ? (
                <AppButton
                  title="Abrir Ficha del Producto"
                  onPress={() =>
                    router.push(`/(private)/products/${validation.targetId}`)
                  }
                />
              ) : null}

              {validation.action === 'OPEN_SALE' && validation.targetId ? (
                <AppButton
                  title="Abrir Comprobante de Venta"
                  onPress={() =>
                    router.push(`/(private)/sales/${validation.targetId}`)
                  }
                />
              ) : null}
            </View>
          ) : null}

          <AppButton
            title="Escanear otro código"
            variant="outline"
            onPress={reset}
          />
        </View>
      ) : (
        <Text style={styles.text}>
          Apuntá la cámara hacia el código QR impreso en la lata o comprobante.
        </Text>
      )}

      <Card>
        <Text style={styles.resultTitle}>Lectura rápida de etiquetas frecuentes</Text>
        <AppButton
          title="Látex Acrílico Interior 20L (SKU LAT-INT-20L)"
          variant="secondary"
          onPress={() => onScanned('PINTAME:PRODUCT:prod-101')}
        />
        <AppButton
          title="Comprobante Factura A #0001-00001024"
          variant="outline"
          onPress={() => onScanned('PINTAME:SALE:sale-301')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },
  cameraBox: {
    height: 300,
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  camera: { flex: 1 },
  pausedBanner: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  resultBox: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  resultTitle: {
    fontWeight: '800',
    color: theme.colors.text,
    fontSize: theme.typography.body,
  },
  resultText: {
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.small,
  },
  validationBox: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceMuted,
  },
  validationStatus: {
    fontWeight: '800',
    fontSize: theme.typography.small,
  },
  validOk: {
    color: theme.colors.success,
  },
  validErr: {
    color: theme.colors.danger,
  },
  validationTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 4,
  },
});
