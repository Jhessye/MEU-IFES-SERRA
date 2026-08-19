import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [noticias, setNoticias] = useState(false);
  const [oportunidades, setOportunidades] = useState(false);
  const [editais, setEditais] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPreferencias();
  }, []);

  const carregarPreferencias = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');
      if (!id) return;
      setUserId(id);

      const { data } = await api.get(`/usuario/${id}`);
      setNoticias(data.recebeNotificacaoNoticia);
      setOportunidades(data.recebeNotificacaoOportunidade);
      setEditais(data.recebeNotificacaoEdital);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setCarregando(false);
    }
  };

  const alternar = async (
    tipo: 'noticia' | 'edital' | 'oportunidade',
    valorAtual: boolean,
    setter: (v: boolean) => void
  ) => {
    if (!userId) return;
    setter(!valorAtual); // feedback imediato

    try {
      await api.patch(`/usuario/${userId}/notificacao/${tipo}`);
    } catch (error) {
      console.error(`Erro ao alternar ${tipo}:`, error);
      setter(valorAtual); // reverte se a chamada falhar
    }
  };

  const voltar = () => router.back();
  const abrirTermos = async () => {};

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.greenAccent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.greenAccent, '#7bc284', '#ffffff']}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={voltar} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={27} color={colors.red} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações</Text>
          <View style={styles.headerRight} />
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Ativar Notificações</Text>

        <NotificationRow
          label="Notícias"
          value={noticias}
          onChange={() => alternar('noticia', noticias, setNoticias)}
          activeColor={colors.red}
        />
        <NotificationRow
          label="Oportunidades"
          value={oportunidades}
          onChange={() => alternar('oportunidade', oportunidades, setOportunidades)}
          activeColor={colors.red}
        />
        <NotificationRow
          label="Editais"
          value={editais}
          onChange={() => alternar('edital', editais, setEditais)}
          activeColor="#222"
        />

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Segurança e Permissões</Text>
        <TouchableOpacity style={styles.termsRow} activeOpacity={0.7} onPress={abrirTermos}>
          <Ionicons name="document-text-outline" size={22} color="#292929" />
          <Text style={styles.termsText}>Termos de Uso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function NotificationRow({ label, value, onChange, activeColor }: {
  label: string; value: boolean; onChange: () => void; activeColor: string;
}) {
  return (
    <View style={styles.notificationRow}>
      <Text style={[styles.notificationLabel, { color: value ? activeColor : '#222' }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#D9D9D9', true: '#4CC463' }}
        thumbColor={colors.white}
        ios_backgroundColor="#D9D9D9"
      />
    </View>
  );
}

// ...os `styles` que você já tinha continuam iguais, sem mudança

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  headerGradient: {
    height: 130,
    width: '100%',
  },

  header: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,
  },

  backButton: {
    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,

    textAlign: 'center',

    fontSize: 26,

    fontWeight: '600',

    color: colors.white,
  },

  headerRight: {
    width: 50,
  },

  content: {
    flex: 1,

    paddingHorizontal: 18,

    paddingTop: 8,
  },

  sectionTitle: {
    fontSize: 14,

    color: '#8A8A8A',

    fontWeight: '600',

    marginTop: 5,

    marginBottom: 10,
  },

  notificationRow: {
    height: 40,

    width: 174,

    borderRadius: 22,

    backgroundColor: '#E9E9EB',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingLeft: 14,

    paddingRight: 6,

    marginBottom: 8,
  },

  notificationLabel: {
    fontSize: 14,

    fontWeight: '500',
  },

  separator: {
    height: 1,

    backgroundColor: '#E8E8E8',

    marginTop: 10,

    marginBottom: 12,
  },

  termsRow: {
    height: 40,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    paddingHorizontal: 2,
  },

  termsText: {
    fontSize: 13,

    fontWeight: '600',

    color: '#222',
  },

});