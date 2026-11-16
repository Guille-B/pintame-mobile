import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { getClientById } from '@/features/clients/clients.service';
import { Client } from '@/features/clients/clients.types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [client, setClient] = useState<Client | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getClientById(id)
      .then(setClient)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <FeedbackState variant="loading" title="Cargando ficha del cliente..." />
      </Screen>
    );
  }

  if (!client) {
    return (
      <Screen>
        <FeedbackState
          variant="error"
          title="Cliente no encontrado"
          description="El cliente solicitado no existe en el padrón."
          actionLabel="Volver a clientes"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title={client.name}
        subtitle={`CUIT / DNI: ${client.cuitOrDni} · Cliente desde: ${client.registeredAt}`}
        badge={client.type}
      />

      <Card>
        {client.businessName ? (
          <>
            <Text style={styles.label}>Razón Social</Text>
            <Text style={styles.value}>{client.businessName}</Text>
          </>
        ) : null}
        <Text style={styles.label}>Teléfono de contacto</Text>
        <Text style={styles.value}>{client.phone}</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={styles.value}>{client.email}</Text>

        <Text style={styles.label}>Línea de productos habitual</Text>
        <Text style={styles.value}>{client.preferredCategory}</Text>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>
          Historial de Compras ({client.purchaseHistory.length})
        </Text>
        {client.purchaseHistory.length === 0 ? (
          <Text style={styles.emptyText}>
            Este cliente aún no registra comprobantes de compra emitidos.
          </Text>
        ) : (
          client.purchaseHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyTop}>
                <Text style={styles.ticket}>{item.ticketNumber}</Text>
                <Text style={styles.amount}>
                  ${item.total.toLocaleString('es-AR')}
                </Text>
              </View>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.summary}>{item.itemsSummary}</Text>
              <Link href={`/(private)/sales/${item.saleId}`} asChild>
                <AppButton title="Ver comprobante" variant="outline" />
              </Link>
            </View>
          ))
        )}
      </Card>

      <AppButton
        title="Volver a la cartera de clientes"
        variant="outline"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
    fontWeight: '700',
    marginTop: 6,
  },
  value: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceMuted,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticket: {
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  amount: {
    fontWeight: '800',
    color: theme.colors.success,
  },
  date: {
    fontSize: theme.typography.small,
    color: theme.colors.muted,
  },
  summary: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    marginVertical: 4,
  },
});
