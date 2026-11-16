import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useProductForm } from '@/features/products/useProductForm';
import { PRODUCT_CATEGORIES } from '@/features/products/products.service';
import { TechnicalAttribute } from '@/features/products/products.types';
import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { AppInput } from '@/components/ui/AppInput';
import { AppButton } from '@/components/ui/AppButton';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { theme } from '@/constants/theme';

const FINISH_OPTIONS: TechnicalAttribute['finish'][] = [
  'Mate',
  'Satinado',
  'Brillante',
  'Semimate',
];

const BASE_OPTIONS: TechnicalAttribute['base'][] = [
  'Acuosa',
  'Solvente',
  'Acrílica',
  'Poliuretánica',
];

export default function ProductFormScreen() {
  const { values, setters, errors, submitting, submitError, submit } =
    useProductForm();

  async function handleSave() {
    const created = await submit();
    if (created) {
      router.push('/(private)/products');
    }
  }

  return (
    <Screen>
      <SectionHeader
        title="Alta de Producto"
        subtitle="Registrá una nueva pintura o insumo con sus especificaciones técnicas"
      />

      {submitError ? (
        <FeedbackState
          variant="error"
          title="No se pudo guardar"
          description={submitError}
        />
      ) : null}

      <Card>
        <Text style={styles.sectionTitle}>Datos comerciales e inventario</Text>

        <AppInput
          label="Nombre del producto *"
          value={values.name}
          onChangeText={setters.setName}
          placeholder="Ej: Látex Exterior Acrílico Antihongos 20L"
          error={errors.name}
        />

        <AppInput
          label="Descripción técnica *"
          value={values.description}
          onChangeText={setters.setDescription}
          placeholder="Detalle de cobertura, resistencia y lavado..."
          multiline
          error={errors.description}
        />

        <Text style={styles.fieldLabel}>Categoría *</Text>
        <View style={styles.optionsRow}>
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = values.category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setters.setCategory(cat)}
                style={[styles.optionBtn, active && styles.optionBtnActive]}
              >
                <Text
                  style={[styles.optionText, active && styles.optionTextActive]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <AppInput
          label="Precio unitario ($ ARS) *"
          value={values.price}
          onChangeText={setters.setPrice}
          placeholder="Ej: 89500"
          keyboardType="numeric"
          error={errors.price}
        />

        <View style={styles.twoCols}>
          <View style={styles.col}>
            <AppInput
              label="Stock inicial *"
              value={values.currentStock}
              onChangeText={setters.setCurrentStock}
              keyboardType="numeric"
              error={errors.currentStock}
            />
          </View>
          <View style={styles.col}>
            <AppInput
              label="Stock mínimo de reposición *"
              value={values.minStock}
              onChangeText={setters.setMinStock}
              keyboardType="numeric"
              error={errors.minStock}
            />
          </View>
        </View>

        <AppInput
          label="Proveedor / Marca"
          value={values.supplierName}
          onChangeText={setters.setSupplierName}
          placeholder="Ej: Alba / Sinteplast"
        />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Ficha Técnica y Rendimiento</Text>

        <AppInput
          label="Superficie recomendada *"
          value={values.surface}
          onChangeText={setters.setSurface}
          placeholder="Ej: Mampostería / Revoque / Ladrillo"
          error={errors.surface}
        />

        <Text style={styles.fieldLabel}>Acabado</Text>
        <View style={styles.optionsRow}>
          {FINISH_OPTIONS.map((item) => {
            const active = values.finish === item;
            return (
              <Pressable
                key={item}
                onPress={() => setters.setFinish(item)}
                style={[styles.optionBtn, active && styles.optionBtnActive]}
              >
                <Text
                  style={[styles.optionText, active && styles.optionTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Base</Text>
        <View style={styles.optionsRow}>
          {BASE_OPTIONS.map((item) => {
            const active = values.base === item;
            return (
              <Pressable
                key={item}
                onPress={() => setters.setBase(item)}
                style={[styles.optionBtn, active && styles.optionBtnActive]}
              >
                <Text
                  style={[styles.optionText, active && styles.optionTextActive]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.twoCols}>
          <View style={styles.col}>
            <AppInput
              label="Rendimiento (m²/L)"
              value={values.yieldM2PerLiter}
              onChangeText={setters.setYieldM2PerLiter}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.col}>
            <AppInput
              label="Litros del envase"
              value={values.liters}
              onChangeText={setters.setLiters}
              keyboardType="numeric"
            />
          </View>
        </View>

        <AppInput
          label="Color / Tono"
          value={values.colorName}
          onChangeText={setters.setColorName}
          placeholder="Ej: Blanco Puro / Gris Cemento"
        />
      </Card>

      <AppButton
        title={submitting ? 'Guardando producto...' : 'Guardar Producto en Catálogo'}
        onPress={handleSave}
        disabled={submitting}
      />

      <AppButton
        title="Consultar centro de ayuda"
        variant="outline"
        onPress={() => router.push('/(private)/help')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    fontWeight: '700',
  },
  optionTextActive: {
    color: 'white',
  },
  twoCols: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  col: {
    flex: 1,
  },
});
