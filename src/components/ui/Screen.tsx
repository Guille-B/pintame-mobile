import { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}>;

export function Screen({
  children,
  scroll = true,
  style,
  contentContainerStyle,
}: Props) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, style]} edges={['bottom', 'left', 'right']}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={['bottom', 'left', 'right']}>
      <View style={[styles.flex, styles.content, contentContainerStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
});
