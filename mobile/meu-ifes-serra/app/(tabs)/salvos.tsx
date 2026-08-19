import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

type ItemSalvo = {
  id: string;
  tipo: 'noticia' | 'edital' | 'oportunidade';
  titulo: string;
  expiracao?: string;
};

const salvos: ItemSalvo[] = [
  {
    id: '1',
    tipo: 'noticia',
    titulo: 'Label text',
  },
  {
    id: '2',
    tipo: 'noticia',
    titulo: 'Label text',
  },
  {
    id: '3',
    tipo: 'edital',
    titulo: 'Label text',
  },
  {
    id: '4',
    tipo: 'oportunidade',
    titulo: 'Label text',
    expiracao: 'expira 3 dias',
  },
  {
    id: '5',
    tipo: 'edital',
    titulo: 'Label text',
  },
  {
    id: '6',
    tipo: 'edital',
    titulo: 'Label text',
  },
];

export default function SalvosScreen() {
  const router = useRouter();

  const voltar = () => {
    router.back();
  };

  return (
    <View style={styles.container}>

      {/* ==============================================
          HEADER
          ============================================== */}

      <LinearGradient
        colors={[
          colors.greenAccent,
          '#7bc284',
          '#ffffff',
        ]}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >

        <SafeAreaView
          edges={['top']}
          style={styles.header}
        >

          <TouchableOpacity
            style={styles.backButton}
            onPress={voltar}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={27}
              color={colors.red}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Salvos
          </Text>

          <View style={styles.headerRight} />

        </SafeAreaView>

      </LinearGradient>

      {/* ==============================================
          LISTA
          ============================================== */}

      <View style={styles.content}>

        {salvos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.savedItem}
            activeOpacity={0.7}
          >

            {/* BOOKMARK */}

            <Ionicons
              name="bookmark"
              size={20}
              color={colors.red}
            />

            {/* ÍCONE DO TIPO */}

            <Ionicons
              name={
                item.tipo === 'noticia'
                  ? 'newspaper-outline'
                  : item.tipo === 'edital'
                    ? 'document-text-outline'
                    : 'briefcase-outline'
              }
              size={20}
              color="#292929"
            />

            {/* TÍTULO */}

            <View style={styles.titleContainer}>

              <Text
                style={styles.itemTitle}
                numberOfLines={1}
              >
                {item.titulo}
              </Text>

              {item.expiracao && (
                <Text style={styles.expiration}>
                  - {item.expiracao}
                </Text>
              )}

            </View>

            {/* SETA */}

            <Ionicons
              name="chevron-forward"
              size={16}
              color="#555"
            />

          </TouchableOpacity>
        ))}

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