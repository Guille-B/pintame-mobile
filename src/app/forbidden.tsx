import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';

export default function ForbiddenScreen() {
  return (
    <Screen>
      <FeedbackState
        variant="error"
        title="Acceso no autorizado"
        description="Tu rol actual no posee permisos para acceder a esta sección operativa de Píntame."
        actionLabel="Volver al panel principal"
        onAction={() => router.replace('/(private)')}
      />
    </Screen>
  );
}
