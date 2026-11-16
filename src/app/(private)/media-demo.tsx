import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMediaCapture } from '@/features/media/useMediaCapture';
import { updateProductPhoto } from '@/features/products/products.service';
import { PhotoPreview } from '@/components/media/PhotoPreview';
import { MediaActionBar } from '@/components/media/MediaActionBar';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function MediaDemoScreen() {
  const { productId, productName } = useLocalSearchParams<{
    productId?: string;
    productName?: string;
  }>();
  const {
    photo,
    comparison,
    loading,
    optimizing,
    error,
    openGallery,
    openSystemCamera,
    optimizeCurrentPhoto,
    discard,
  } = useMediaCapture();
  const [savedNotice, setSavedNotice] = useState('');

  async function handleAttachToProduct() {
    if (!photo) return;
    const targetId = productId || 'prod-101';
    const finalUri = comparison ? comparison.optimizedPhoto.uri : photo.uri;
    await updateProductPhoto(targetId, finalUri);
    setSavedNotice(
      `Fotografía vinculada a la ficha de ${
        productName ?? 'Látex Acrílico Interior Premium 20L'
      }.`
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Registro Fotográfico y Muestras"
        subtitle="Capturá o seleccioná fotos de envases, muestras de color y remitos de proveedor"
      />

      <Card style={styles.privacyCard}>
        <Text style={styles.privacyTitle}>
          Gestión visual de catálogo y depósito
        </Text>
        <Text style={styles.privacyText}>
          Fotografiá envases de pintura, muestras aplicadas o comprobantes de
          recepción de mercadería y optimizá su peso antes de asociarlos al
          inventario.
        </Text>
      </Card>

      <MediaActionBar
        loading={loading}
        optimizing={optimizing}
        hasPhoto={Boolean(photo)}
        onTakePhoto={openSystemCamera}
        onPickGallery={openGallery}
        onOptimize={optimizeCurrentPhoto}
        onDiscard={() => {
          setSavedNotice('');
          discard();
        }}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
      ) : null}

      {error ? (
        <FeedbackState
          variant="error"
          title="Captura no disponible"
          description={error}
        />
      ) : null}

      {savedNotice ? (
        <FeedbackState
          variant="success"
          title="Imagen asociada al producto"
          description={savedNotice}
          actionLabel="Ver ficha del producto"
          onAction={() =>
            router.push(`/(private)/products/${productId || 'prod-101'}`)
          }
        />
      ) : null}

      {photo ? (
        <>
          <PhotoPreview photo={photo} comparison={comparison} />
          <AppButton
            title={`Asociar imagen a ${
              productName ? productName : 'Látex Interior 20L'
            }`}
            onPress={handleAttachToProduct}
          />
        </>
      ) : null}

      <Card>
        <Text style={styles.techTitle}>Calidad de imagen recomendada</Text>
        <Text style={styles.techBody}>
          • Para fotografías de envases en el catálogo, la optimización a 1024px
          (calidad 75%) reduce el consumo de datos y acelera la carga en
          mostrador.{'\n'}
          • Si fotografiás etiquetas con números de lote pequeños, remitos con
          texto fino o cartas colorimétricas, conservá la toma sin comprimir para
          preservar la legibilidad y el matiz exacto del color.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  privacyCard: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  privacyTitle: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  privacyText: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    marginTop: 4,
    lineHeight: 19,
  },
  loader: {
    marginVertical: theme.spacing.sm,
  },
  techTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  techBody: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    lineHeight: 20,
  },
});
