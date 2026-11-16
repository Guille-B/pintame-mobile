import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { Screen } from '@/components/ui/Screen';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { theme } from '@/constants/theme';

export default function PrivateLayout() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <Screen>
        <FeedbackState
          variant="loading"
          title="Verificando sesión..."
          description="Cargando datos de tu sucursal en Píntame."
        />
      </Screen>
    );
  }

  if (!user) {
    return <Redirect href="/(public)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '800' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Píntame · Panel Principal' }} />
      <Stack.Screen
        name="products/index"
        options={{ title: 'Catálogo y Stock' }}
      />
      <Stack.Screen
        name="products/[id]"
        options={{ title: 'Ficha Técnica de Pintura' }}
      />
      <Stack.Screen
        name="products/form"
        options={{ title: 'Nuevo Producto' }}
      />
      <Stack.Screen
        name="category/[name]"
        options={{ title: 'Línea de Productos' }}
      />
      <Stack.Screen
        name="clients/index"
        options={{ title: 'Cartera de Clientes' }}
      />
      <Stack.Screen
        name="clients/[id]"
        options={{ title: 'Ficha de Cliente' }}
      />
      <Stack.Screen
        name="clients/form"
        options={{ title: 'Alta de Cliente' }}
      />
      <Stack.Screen
        name="sales/index"
        options={{ title: 'Ventas, Caja y Facturación' }}
      />
      <Stack.Screen
        name="sales/[id]"
        options={{ title: 'Comprobante Electrónico' }}
      />
      <Stack.Screen
        name="sales/new"
        options={{ title: 'Punto de Venta' }}
      />
      <Stack.Screen
        name="qr-scanner"
        options={{ title: 'Lector QR de Sucursal' }}
      />
      <Stack.Screen
        name="location-demo"
        options={{ title: 'Logística y Punto de Entrega' }}
      />
      <Stack.Screen
        name="media-demo"
        options={{ title: 'Registro Fotográfico y Muestras' }}
      />
      <Stack.Screen
        name="camera-preview"
        options={{ title: 'Cámara de Mostrador' }}
      />
      <Stack.Screen name="profile" options={{ title: 'Mi Perfil' }} />
      <Stack.Screen name="about" options={{ title: 'Acerca de Píntame' }} />
      <Stack.Screen name="help" options={{ title: 'Centro de Ayuda' }} />
    </Stack>
  );
}
