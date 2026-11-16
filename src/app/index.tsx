import { Redirect } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';

export default function EntryGateScreen() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <Screen>
        <FeedbackState
          variant="loading"
          title="Iniciando Píntame..."
          description="Restaurando sesión segura desde el dispositivo."
        />
      </Screen>
    );
  }

  if (!user) {
    return <Redirect href="/(public)/login" />;
  }

  return <Redirect href="/(private)" />;
}
