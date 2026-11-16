import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function HelpScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Centro de Ayuda Operativa"
        subtitle="Guía rápida para atención en mostrador, depósito y entregas"
      />

      <Card>
        <Text style={styles.stepTitle}>1. Asesoramiento rápido en mostrador</Text>
        <Text style={styles.stepText}>
          Filtrá el catálogo por categoría (Látex, Esmaltes, Impermeabilizantes,
          Maderas, Accesorios) o buscá por tipo de superficie, acabado o código
          SKU para verificar stock y calcular litros según el rendimiento (m²/L).
        </Text>
      </Card>

      <Card>
        <Text style={styles.stepTitle}>2. Facturación e insumos complementarios</Text>
        <Text style={styles.stepText}>
          Al cargar pinturas en el Punto de Venta, el sistema sugiere
          automáticamente los accesorios e imprimaciones asociados (fijador
          sellador, rodillos, cinta) y descuenta las unidades del inventario al
          emitir el comprobante.
        </Text>
      </Card>

      <Card>
        <Text style={styles.stepTitle}>3. Registro fotográfico y etiquetas QR</Text>
        <Text style={styles.stepText}>
          Usá el Lector QR para identificar latas o comprobantes al instante, y
          empleá el módulo de Registro Fotográfico para asociar imágenes
          optimizadas de envases o muestras de color a cada ficha técnica.
        </Text>
      </Card>

      <AppButton
        title="Ir al Catálogo de Productos"
        onPress={() => router.push('/(private)/products')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  stepText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    lineHeight: 21,
  },
});
