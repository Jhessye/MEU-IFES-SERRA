// app/(onboarding)/welcome.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/theme/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/preferences');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.heading}>
            Ola! :D{'\n'}Seja bem vindo ao seu Ifes Serra.
          </Text>
          <Text style={styles.subtitle}>Vamos personalizar seu ambiente?</Text>
          <View style={styles.dot} />
        </View>

        <View style={styles.featuresBlock}>
          <Text style={styles.sectionTitle}>O que você vai encontrar aqui</Text>

          <View style={styles.featuresRow}>
            <Feature icon="newspaper-outline" label="Notícias" />
            <Feature icon="document-text-outline" label="Editais" />
            <Feature icon="briefcase-outline" label="Oportunidades" />
          </View>

          <Text style={styles.description}>
            Acompanhe atualizações, organize seus processos e encontre tudo o
            que você precisa em um só lugar.
          </Text>
        </View>
      </View>

      <Pressable onPress={handleContinue}>
        <LinearGradient
          colors={[colors.greenAccent, colors.red]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonBorder}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function Feature({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={16} color={colors.red} />
      <Text style={styles.featureLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  content: { flex: 1, gap: 24 },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: colors.greenDark,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.greenAccent,
    marginTop: 12,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red,
    top: 30,
    left: 118, // ajuste fino conforme a fonte que você escolher
  },
  featuresBlock: { gap: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textGray,
  },
  buttonBorder: {
    padding: 2,
    borderRadius: 14,
  },
  buttonInner: {
    flexDirection: 'row',
    gap: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.greenAccent,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});