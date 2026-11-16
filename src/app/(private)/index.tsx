import { StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useSession } from '@/features/auth/useSession';
import { useProducts } from '@/features/products/useProducts';
import { useSales } from '@/features/sales/useSales';
import { useClients } from '@/features/clients/useClients';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function HomeScreen() {
  const { user } = useSession();
  const { allProducts, lowStockCount } = useProducts();
  const { cashSummary } = useSales();
  const { clients } = useClients();

  return (
    <Screen>
      <Card style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.brandTag}>PÍNTAME · SISTEMA DE GESTIÓN</Text>
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>
              {user?.role === 'ADMIN' ? 'ADMINISTRADOR' : 'VENDEDOR'}
            </Text>
          </View>
        </View>
        <Text style={styles.welcome}>Hola, {user?.name}</Text>
        <Text style={styles.slogan}>{theme.brand.slogan}</Text>
        <Text style={styles.branch}>{user?.branch}</Text>
      </Card>

      <View style={styles.kpiRow}>
        <Card
          style={styles.kpiCard}
          onPress={() => router.push('/(private)/products')}
        >
          <Text style={styles.kpiValue}>{allProducts.length}</Text>
          <Text style={styles.kpiLabel}>Productos</Text>
        </Card>
        <Card
          style={[
            styles.kpiCard,
            lowStockCount > 0 ? styles.kpiAlertCard : undefined,
          ]}
          onPress={() => router.push('/(private)/products')}
        >
          <Text
            style={[
              styles.kpiValue,
              lowStockCount > 0 ? styles.kpiAlertValue : undefined,
            ]}
          >
            {lowStockCount}
          </Text>
          <Text style={styles.kpiLabel}>Stock Crítico</Text>
        </Card>
        <Card
          style={styles.kpiCard}
          onPress={() => router.push('/(private)/clients')}
        >
          <Text style={styles.kpiValue}>{clients.length}</Text>
          <Text style={styles.kpiLabel}>Clientes</Text>
        </Card>
      </View>

      <Card style={styles.cashCard}>
        <Text style={styles.cashLabel}>RESUMEN DE CAJA Y FACTURACIÓN</Text>
        <Text style={styles.cashTotal}>
          ${cashSummary.totalAmount.toLocaleString('es-AR')}
        </Text>
        <Text style={styles.cashMeta}>
          {cashSummary.totalTickets} comprobantes emitidos · Ticket promedio: $
          {cashSummary.avgTicket.toLocaleString('es-AR')}
        </Text>
      </Card>

      <SectionHeader
        title="Gestión Comercial"
        subtitle="Inventario técnico, punto de venta, facturación y cartera de clientes"
      />

      <Card>
        <Text style={styles.cardGroupTitle}>Mostrador, Depósito y Caja</Text>
        <Link href="/(private)/products" asChild>
          <AppButton title="Catálogo de Pinturas y Control de Stock" />
        </Link>
        <Link href="/(private)/sales/new" asChild>
          <AppButton
            title="Nueva Venta en Mostrador"
            variant="secondary"
          />
        </Link>
        <Link href="/(private)/sales" asChild>
          <AppButton title="Historial de Ventas y Comprobantes" variant="outline" />
        </Link>
        <Link href="/(private)/clients" asChild>
          <AppButton title="Cartera de Clientes y Cuentas" variant="outline" />
        </Link>
        <Link href="/(private)/products/form" asChild>
          <AppButton
            title="Alta de Nuevo Producto en Catálogo"
            variant="outline"
          />
        </Link>
      </Card>

      <SectionHeader
        title="Herramientas de Sucursal y Logística"
        subtitle="Escaneo de etiquetas, fotografía de muestras de color y entregas en obra"
      />

      <Card>
        <Link href="/(private)/qr-scanner" asChild>
          <AppButton title="Lector QR de Latas y Comprobantes" />
        </Link>
        <Link href="/(private)/media-demo" asChild>
          <AppButton
            title="Fotografía y Optimización de Muestras / Remitos"
            variant="secondary"
          />
        </Link>
        <Link href="/(private)/camera-preview" asChild>
          <AppButton
            title="Cámara de Mostrador con Encuadre Guiado"
            variant="outline"
          />
        </Link>
        <Link href="/(private)/location-demo" asChild>
          <AppButton
            title="Ubicación de Sucursal y Entregas en Obra"
            variant="outline"
          />
        </Link>
      </Card>

      <Card>
        <Text style={styles.cardGroupTitle}>Sucursal y Soporte</Text>
        <View style={styles.bottomLinks}>
          <Link href="/(private)/profile" asChild>
            <AppButton title="Mi Perfil y Sucursal" variant="outline" />
          </Link>
          <Link href="/(private)/about" asChild>
            <AppButton title="Información del Sistema" variant="outline" />
          </Link>
          <Link href="/(private)/help" asChild>
            <AppButton title="Centro de Ayuda Operativa" variant="outline" />
          </Link>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandTag: {
    color: '#BAE6FD',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  rolePill: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  rolePillText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '900',
  },
  welcome: {
    color: 'white',
    fontSize: theme.typography.title,
    fontWeight: '800',
  },
  slogan: {
    color: '#E0F2FE',
    fontSize: theme.typography.small,
    marginTop: 4,
  },
  branch: {
    color: '#BAE6FD',
    fontSize: theme.typography.small,
    marginTop: 6,
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  kpiCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  kpiAlertCard: {
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.dangerBg,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  kpiAlertValue: {
    color: theme.colors.danger,
  },
  kpiLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: '700',
    marginTop: 2,
  },
  cashCard: {
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.secondary,
  },
  cashLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.muted,
  },
  cashTotal: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.text,
    marginVertical: 2,
  },
  cashMeta: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  cardGroupTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  bottomLinks: {
    gap: 4,
  },
});
