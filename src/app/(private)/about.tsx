import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Acerca de Píntame"
        subtitle="Plataforma integral para la gestión comercial y técnica de pinturerías"
      />

      <Card>
        <Text style={styles.heading}>Nuestra misión</Text>
        <Text style={styles.body}>
          Brindar a las pinturerías una herramienta digital ágil, confiable y
          especializada en su rubro para administrar catálogo técnico, stock en
          tiempo real, cartera de clientes, punto de venta y facturación.
        </Text>
      </Card>

      <Card>
        <Text style={styles.heading}>Módulos integrados</Text>
        <Text style={styles.body}>
          • Catálogo especializado por superficie, acabado, base y rendimiento.{'\n'}
          • Alertas automáticas de stock mínimo y trazabilidad de movimientos.{'\n'}
          • Punto de venta con sugerencia de insumos complementarios.{'\n'}
          • Herramientas móviles de lectura QR, fotografía de muestras y logística.
        </Text>
      </Card>

      <Card>
        <Text style={styles.heading}>Equipo de desarrollo</Text>
        <Text style={styles.body}>
          • Alexis Guillermo Bautista Escobar{'\n'}
          • Franco Exequiel Retamal{'\n'}
          • Vanesa Vila{'\n'}
        </Text>
      </Card>

      <AppButton
        title="Volver al panel principal"
        variant="outline"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    marginBottom: 6,
  },
  body: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
});
