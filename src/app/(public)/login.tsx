import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
  const { user, signIn } = useSession();
  const [email, setEmail] = useState('admin@pintame.com.ar');
  const [password, setPassword] = useState('pintame123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Redirect href="/(private)" />;
  }

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('Completá correo electrónico y contraseña para ingresar.');
      return;
    }
    try {
      setError('');
      setSubmitting(true);
      await signIn({ email, password });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Credenciales inválidas o problema de conexión.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoAccount(role: 'ADMIN' | 'SELLER') {
    setError('');
    if (role === 'ADMIN') {
      setEmail('admin@pintame.com.ar');
      setPassword('pintame123');
    } else {
      setEmail('vendedor@pintame.com.ar');
      setPassword('pintame123');
    }
  }

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.brandBox}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>PÍNTAME</Text>
        </View>
        <Text style={styles.title}>Gestión Operativa de Pinturería</Text>
        <Text style={styles.subtitle}>{theme.brand.slogan}</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Acceso al Sistema</Text>
        <Text style={styles.sectionHelper}>
          Ingresá con tu cuenta de sucursal para operar catálogo, caja y clientes.
        </Text>

        {error ? (
          <FeedbackState
            variant="error"
            title="No se pudo iniciar sesión"
            description={error}
          />
        ) : null}

        <AppInput
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="usuario@pintame.com.ar"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        <AppButton
          title={submitting ? 'Ingresando...' : 'Ingresar al sistema'}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </Card>

      <Card style={styles.demoCard}>
        <Text style={styles.demoTitle}>Cambio rápido de perfil de sucursal</Text>
        <Text style={styles.demoSubtitle}>
          Seleccioná un usuario operativo para autocompletar el acceso:
        </Text>
        <View style={styles.demoButtons}>
          <AppButton
            title="Administrador · Alexis Bautista"
            variant="outline"
            onPress={() => fillDemoAccount('ADMIN')}
          />
          <AppButton
            title="Vendedor Mostrador · Franco Retamal"
            variant="secondary"
            onPress={() => fillDemoAccount('SELLER')}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.xl,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logoBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  logoText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: theme.typography.title,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sectionHelper: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginBottom: theme.spacing.md,
  },
  demoCard: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  demoTitle: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  demoSubtitle: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    marginTop: 2,
    marginBottom: theme.spacing.xs,
  },
  demoButtons: {
    gap: 6,
  },
});
