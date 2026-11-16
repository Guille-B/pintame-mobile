import { FlatList, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useClients } from '@/features/clients/useClients';
import { Screen } from '@/components/ui/Screen';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClientCard } from '@/components/clients/ClientCard';

export default function ClientsListScreen() {
  const { clients, isLoading, error, reload } = useClients();

  return (
    <Screen scroll={false}>
      <SectionHeader
        title="Cartera de Clientes"
        subtitle="Particulares, constructoras y consorcios con historial de compras"
        badge={`${clients.length} activos`}
      />

      {isLoading ? (
        <FeedbackState variant="loading" title="Cargando clientes..." />
      ) : error ? (
        <FeedbackState
          variant="error"
          title="Error al cargar clientes"
          description={error}
          actionLabel="Reintentar"
          onAction={reload}
        />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={reload}
          renderItem={({ item }) => (
            <Link href={`/(private)/clients/${item.id}`} asChild>
              <Pressable>
                <ClientCard client={item} />
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <EmptyState
              title="Sin clientes registrados"
              description="Agregá un cliente particular o empresa para asociar ventas y facturas."
            />
          }
        />
      )}

      <AppButton
        title="+ Registrar Nuevo Cliente"
        onPress={() => router.push('/(private)/clients/form')}
      />
    </Screen>
  );
}
