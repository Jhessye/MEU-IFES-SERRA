// app/(onboarding)/preferences.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

export default function PreferencesScreen() {
  const router = useRouter();

  // Estados iniciam como FALSE (padrão do backend)
  const [isNoticiasEnabled, setIsNoticiasEnabled] = useState(false);
  const [isEditaisEnabled, setIsEditaisEnabled] = useState(false);
  const [isOportunidadesEnabled, setIsOportunidadesEnabled] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Pega o ID que já foi criado no _layout.tsx
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('user_id');
      setUserId(id);
    };

    getUserId();
  }, []);

  // Função genérica para alternar as notificações e salvar no backend
  const togglePreference = async (
    type: 'noticia' | 'edital' | 'oportunidade',
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    currentValue: boolean
  ) => {
    if (!userId) return;

    // Atualiza o estado visual imediatamente
    setter(!currentValue);

    // Envia o PATCH para o backend
    try {
      await api.patch(`/usuario/${userId}/notificacao/${type}`);

      // Salva o estado atualizado localmente
      const localPrefs = {
        noticias:
          type === 'noticia' ? !currentValue : isNoticiasEnabled,
        editais:
          type === 'edital' ? !currentValue : isEditaisEnabled,
        oportunidades:
          type === 'oportunidade'
            ? !currentValue
            : isOportunidadesEnabled,
      };

      await AsyncStorage.setItem(
        'user_preferences',
        JSON.stringify(localPrefs)
      );
    } catch (error) {
      console.error(`Erro ao alternar ${type}:`, error);

      // Reverte o estado visual caso dê erro
      setter(currentValue);
    }
  };

  const handleContinue = async () => {
    // Marca o onboarding como concluído
    await AsyncStorage.setItem('has_completed_onboarding', 'true');

    // Vai para a tela principal
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TÍTULO */}
        <Text style={styles.greenTitle}>
          Vamos personalizar seu ambiente?
        </Text>

        {/* SUBTÍTULO */}
        <Text style={styles.blackSubtitle}>
          Escolha quais notificações você deseja receber
        </Text>

        {/* OPÇÕES */}
        <View style={styles.optionsContainer}>
          <OptionRow
            icon="newspaper-outline"
            label="Editais"
            value={isEditaisEnabled}
            onValueChange={() =>
              togglePreference(
                'edital',
                setIsEditaisEnabled,
                isEditaisEnabled
              )
            }
          />

          <OptionRow
            icon="document-text-outline"
            label="Notícias"
            value={isNoticiasEnabled}
            onValueChange={() =>
              togglePreference(
                'noticia',
                setIsNoticiasEnabled,
                isNoticiasEnabled
              )
            }
          />

          <OptionRow
            icon="briefcase-outline"
            label="Oportunidades"
            value={isOportunidadesEnabled}
            onValueChange={() =>
              togglePreference(
                'oportunidade',
                setIsOportunidadesEnabled,
                isOportunidadesEnabled
              )
            }
          />
        </View>

        {/* BOTÃO CONTINUAR */}
        <Pressable
          onPress={handleContinue}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={[colors.greenAccent, colors.red]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonBorder}
          >
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>
                Continuar
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={colors.white}
              />
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// -----------------------------------------------------
// COMPONENTE DA LINHA
// -----------------------------------------------------

function OptionRow({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: any;
  label: string;
  value: boolean;
  onValueChange: () => void;
}) {
  return (
    <View style={styles.optionRow}>
      <View style={styles.optionLeft}>
        <View style={styles.iconBox}>
          <Ionicons
            name={icon}
            size={18}
            color={colors.red}
          />
        </View>

        <Text style={styles.optionLabel}>
          {label}
        </Text>
      </View>

      <Switch
        trackColor={{
          false: '#E5E5E5',
          true: colors.greenAccent,
        }}
        thumbColor={colors.white}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

// -----------------------------------------------------
// ESTILOS
// -----------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  greenTitle: {
    width: '100%',
    maxWidth: 380,
    fontSize: 18,
    fontWeight: '700',
    color: colors.greenAccent,
    textAlign: 'left',
    marginBottom: 8,
  },

  blackSubtitle: {
    width: '100%',
    maxWidth: 380,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 28,
  },

  optionsContainer: {
    width: '60%',
    alignSelf: 'flex-start',
    maxWidth: 380,
    gap: 16,
  },

  optionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 20,

    shadowColor: '#136120',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconBox: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.8,
    borderColor: colors.red,
    borderRadius: 9,
  },

  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },

  buttonWrapper: {
    width: '70%',
    maxWidth: 380,
    marginTop: 34,
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
    fontSize: 18,
    fontWeight: '700',
  },
});