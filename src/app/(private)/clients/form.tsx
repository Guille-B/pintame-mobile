import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useClientForm } from '@/features/clients/useClients';
import { ClientType } from '@/features/clients/clients.types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

const CLIENT_TYPES: ClientType[] = ['PARTICULAR', 'EMPRESA'];

export default function ClientFormScreen() {
  const { values, setters, errors, submitting, submit } = useClientForm();

  async function handleSave() {
    const created = await submit();
    if (created) {
      router.push('/(private)/clients');
    }
  }

  return (
    <Screen>
      <SectionHeader
        title="Alta de Cliente"
        subtitle="Registrar cliente particular o empresa para facturación e historial"
      />

      <Card>
        <Text style={styles.fieldLabel}>Tipo de cliente</Text>
        <View style={styles.row}>
          {CLIENT_TYPES.map((t) => {
            const active = values.type === t;
            return (
              <Pressable
                key={t}
                onPress={() => setters.setType(t)}
                style={[styles.typeBtn, active && styles.typeBtnActive]}
              >
                <Text
                  style={[styles.typeText, active && styles.typeTextActive]}
                >
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <AppInput
          label="Nombre completo o denominación *"
          value={values.name}
          onChangeText={setters.setName}
          placeholder="Ej: Constructora del Sur S.A. / Juan Pérez"
          error={errors.name}
        />

        {values.type === 'EMPRESA' ? (
          <AppInput
            label="Razón Social"
            value={values.businessName}
            onChangeText={setters.setBusinessName}
            placeholder="Razón social para Factura A"
          />
        ) : null}

        <AppInput
          label="CUIT o DNI *"
          value={values.cuitOrDni}
          onChangeText={setters.setCuitOrDni}
          placeholder="Ej: 30-71234567-9 o 35.123.456"
          error={errors.cuitOrDni}
        />

        <AppInput
          label="Teléfono *"
          value={values.phone}
          onChangeText={setters.setPhone}
          placeholder="+54 299 400-0000"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <AppInput
          label="Correo electrónico *"
          value={values.email}
          onChangeText={setters.setEmail}
          placeholder="cliente@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <AppInput
          label="Rubro / Preferencia de compra"
          value={values.preferredCategory}
          onChangeText={setters.setPreferredCategory}
          placeholder="Ej: Látex e Impermeabilizantes"
        />
      </Card>

      <AppButton
        title={submitting ? 'Guardando...' : 'Guardar Cliente'}
        onPress={handleSave}
        disabled={submitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: theme.spacing.sm,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  typeBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeText: {
    fontWeight: '800',
    color: theme.colors.text,
  },
  typeTextActive: {
    color: 'white',
  },
});
