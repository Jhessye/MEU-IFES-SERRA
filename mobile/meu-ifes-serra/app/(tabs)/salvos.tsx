import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

type ItemSalvo = {
  id: string;
  tipo: 'edital' | 'oportunidade';
  titulo: string;
};

export default function SalvosScreen() {
  const router = useRouter();
  const [salvos, setSalvos] = useState<ItemSalvo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarSalvos();
  }, []);

  const carregarSalvos = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const { data } = await api.get(`/usuario/${userId}`);

      const editais = (data.editais_salvos || []).map((e: any) => ({
        id: e.id, tipo: 'edital' as const, titulo: e.titulo,
      }));
      const oportunidades = (data.oportunidades_salvas || []).map((o: any) => ({
        id: o.id, tipo: 'oportunidade' as const, titulo: o.titulo,
      }));

      setSalvos([...editais, ...oportunidades]);
    } catch (error) {
      console.error('Erro ao carregar salvos:', error);
    } finally {
      setCarregando(false);
    }
  };

  const voltar = () => router.back();

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
          <Text style={styles.headerTitle}>Salvos</Text>
          <View style={styles.headerRight} />
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        {carregando ? (
          <ActivityIndicator style={{ marginTop: 30 }} color={colors.greenAccent} />
        ) : salvos.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 30 }}>
            Você ainda não salvou nada.
          </Text>
        ) : (
          salvos.map((item) => (
            <TouchableOpacity key={`${item.tipo}-${item.id}`} style={styles.savedItem} activeOpacity={0.7}>
              <Ionicons name="bookmark" size={20} color={colors.red} />
              <Ionicons
                name={item.tipo === 'edital' ? 'document-text-outline' : 'briefcase-outline'}
                size={20}
                color="#292929"
              />
              <View style={styles.titleContainer}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.titulo}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#555" />
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
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

  savedItem: {
    minHeight: 43,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    borderBottomWidth: 0,

    paddingHorizontal: 2,
  },

  titleContainer: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    minWidth: 0,
  },

  itemTitle: {
    fontSize: 14,

    color: '#292929',

    flexShrink: 1,
  },

  expiration: {
    fontSize: 12,

    color: colors.red,

    marginLeft: 3,
  },
});