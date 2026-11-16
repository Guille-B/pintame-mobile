import { useRef, useState } from 'react';
import { pickPhoto, takeSystemPhoto } from './media.service';
import { compareAndOptimizePhoto, fileSizeInBytes } from './image.service';
import type { LocalPhoto, OptimizationComparison } from './media.types';

export function useMediaCapture() {
  const [photo, setPhoto] = useState<LocalPhoto | null>(null);
  const [comparison, setComparison] = useState<OptimizationComparison | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);

  async function run(action: () => Promise<LocalPhoto | null>) {
    if (loading || busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await action();
      // Si result es null fue una cancelación voluntaria: se conserva el estado previo sin error
      if (result) {
        const sizeFromFs = fileSizeInBytes(result.uri);
        setPhoto({
          ...result,
          fileSize: result.fileSize ?? sizeFromFs ?? undefined,
        });
        setComparison(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo obtener la foto.');
    } finally {
      setLoading(false);
      busyRef.current = false;
    }
  }

  async function runOptimization() {
    if (!photo || optimizing) return;
    setOptimizing(true);
    setError(null);
    try {
      const result = await compareAndOptimizePhoto(photo.uri, photo.fileSize);
      setComparison(result);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'No se pudo optimizar el archivo temporal. Intentá repetir la captura.'
      );
    } finally {
      setOptimizing(false);
    }
  }

  function discard() {
    setPhoto(null);
    setComparison(null);
    setError(null);
  }

  return {
    photo,
    comparison,
    loading,
    optimizing,
    error,
    openGallery: () => run(pickPhoto),
    openSystemCamera: () => run(takeSystemPhoto),
    optimizeCurrentPhoto: runOptimization,
    discard,
  };
}
