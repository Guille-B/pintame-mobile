import { StyleSheet, View } from 'react-native';
import { AppButton } from '@/components/ui/AppButton';

type Props = {
  loading: boolean;
  optimizing?: boolean;
  hasPhoto: boolean;
  onTakePhoto: () => void;
  onPickGallery: () => void;
  onOptimize?: () => void;
  onDiscard: () => void;
};

export function MediaActionBar({
  loading,
  optimizing,
  hasPhoto,
  onTakePhoto,
  onPickGallery,
  onOptimize,
  onDiscard,
}: Props) {
  return (
    <View style={styles.container}>
      <AppButton
        title="Tomar fotografía"
        onPress={onTakePhoto}
        disabled={loading || optimizing}
      />
      <AppButton
        title="Elegir de galería"
        variant="secondary"
        onPress={onPickGallery}
        disabled={loading || optimizing}
      />
      {hasPhoto && onOptimize ? (
        <AppButton
          title={
            optimizing
              ? 'Optimizando copia JPEG...'
              : 'Optimizar imagen (JPEG máx. 1024px)'
          }
          variant="outline"
          onPress={onOptimize}
          disabled={loading || optimizing}
        />
      ) : null}
      {hasPhoto ? (
        <AppButton
          title="Descartar"
          variant="danger"
          onPress={onDiscard}
          disabled={loading || optimizing}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
});
