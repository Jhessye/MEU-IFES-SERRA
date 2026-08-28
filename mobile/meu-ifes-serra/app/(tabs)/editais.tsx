import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

type Edital = {
  id: string;
  titulo: string;
  link: string;
  pdf?: string | null;
  formulario?: string | null;
  texto: string;
};

export default function EditaisScreen() {
  const navigation = useNavigation();

  const [editais, setEditais] = useState<Edital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [salvos, setSalvos] = useState<Set<string>>(new Set());

  // ==================================================
  // INICIALIZAÇÃO
  // ==================================================

  useEffect(() => {
    buscarEditais();

    AsyncStorage.getItem('user_id').then((id) => {
      setUserId(id);

      if (id) {
        carregarSalvos(id);
      }
    });
  }, []);

  // Recarrega a lista e os salvos quando a tela volta a receber foco.
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearch('');
      buscarEditais();

      if (userId) {
        carregarSalvos(userId);
      }
    });

    return unsubscribe;
  }, [navigation, userId]);

  // ==================================================
  // BUSCAR EDITAIS
  // ==================================================

  const buscarEditais = async () => {
    try {
      setIsLoading(true);

      const response = await api.get('/edital');

      const dados =
        response.data?.items ||
        response.data?.resultados ||
        response.data;

      setEditais(
        Array.isArray(dados) ? dados : []
      );
    } catch (error) {
      console.error(
        'Erro ao buscar editais:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================
  // PESQUISAR EDITAIS
  // ==================================================

  const pesquisar = async (termo: string) => {
    setSearch(termo);

    if (!termo.trim()) {
      buscarEditais();
      return;
    }

    try {
      setIsSearching(true);

      const response = await api.get(
        '/search/editais',
        {
          params: {
            q: termo,
          },
        }
      );

      const resultados =
        response.data?.resultados || [];

      setEditais(
        Array.isArray(resultados)
          ? resultados
          : []
      );
    } catch (error) {
      console.error(
        'Erro ao pesquisar editais:',
        error
      );
    } finally {
      setIsSearching(false);
    }
  };

  // ==================================================
  // SALVOS
  // ==================================================

  const carregarSalvos = async (id: string) => {
    try {
      const { data } =
        await api.get(`/usuario/${id}`);

      const ids = (
        data.editais_salvos || []
      ).map((e: any) => e.id);

      setSalvos(new Set(ids));
    } catch (error) {
      console.error(
        'Erro ao carregar editais salvos:',
        error
      );
    }
  };

  // ==================================================
  // SALVAR / DESSALVAR
  // ==================================================

  const alternarSalvo = async (
    editalId: string
  ) => {
    if (!userId) return;

    const jaSalvo = salvos.has(editalId);

    setSalvos((prev) => {
      const novo = new Set(prev);

      if (jaSalvo) {
        novo.delete(editalId);
      } else {
        novo.add(editalId);
      }

      return novo;
    });

    try {
      if (jaSalvo) {
        await api.delete(
          `/usuario/${userId}/dessalvar_edital/${editalId}`
        );
      } else {
        await api.post(
          `/usuario/${userId}/salvar_edital/${editalId}`
        );
      }
    } catch (error) {
      console.error(
        'Erro ao salvar edital:',
        error
      );

      // Volta o estado caso a requisição dê erro
      setSalvos((prev) => {
        const novo = new Set(prev);

        if (jaSalvo) {
          novo.add(editalId);
        } else {
          novo.delete(editalId);
        }

        return novo;
      });
    }
  };

  // ==================================================
  // ABRIR LINK NO NAVEGADOR
  // ==================================================

  const abrirLink = async (
    url?: string | null
  ) => {
    if (!url) return;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(
        'Erro ao abrir link:',
        error
      );
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.greenAccent}
        />

        <Text style={styles.loadingText}>
          Carregando editais...
        </Text>
      </View>
    );
  }

  // ==================================================
  // TELA
  // ==================================================

  return (
    <View style={styles.container}>

      {/* PESQUISA */}

      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={pesquisar}
          placeholder="Pesquisar"
          placeholderTextColor="#BDBDBD"
          style={styles.searchInput}
        />

        {isSearching ? (
          <ActivityIndicator
            size="small"
            color={colors.red}
          />
        ) : (
          <Ionicons
            name="search-outline"
            size={19}
            color={colors.red}
          />
        )}
      </View>

      {/* LISTA */}

      <FlatList
        data={editais}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EditalCard
            edital={item}
            abrirLink={abrirLink}
            salvo={salvos.has(item.id)}
            onToggleSalvo={() =>
              alternarSalvo(item.id)
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={44}
              color="#D0D0D0"
            />

            <Text style={styles.emptyText}>
              Nenhum edital encontrado.
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ======================================================
// CARD DO EDITAL
// ======================================================

function EditalCard({
  edital,
  abrirLink,
  salvo,
  onToggleSalvo,
}: {
  edital: Edital;
  abrirLink: (url?: string | null) => void;
  salvo: boolean;
  onToggleSalvo: () => void;
}) {
  return (
    <View style={styles.card}>

      {/* BOOKMARK */}

      <TouchableOpacity
        style={styles.bookmarkButton}
        activeOpacity={0.7}
        onPress={onToggleSalvo}
      >
        <Ionicons
          name={
            salvo
              ? 'bookmark'
              : 'bookmark-outline'
          }
          size={23}
          color={
            salvo
              ? colors.red
              : '#202020'
          }
        />
      </TouchableOpacity>

      {/* CONTEÚDO */}

      <View style={styles.cardContent}>

        {/* TÍTULO / LINK DO EDITAL */}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            abrirLink(edital.link)
          }
        >
          <Text
            style={styles.title}
            numberOfLines={2}
          >
            {edital.titulo}
          </Text>
        </TouchableOpacity>

        {/* DESCRIÇÃO */}

        <Text
          style={styles.description}
          numberOfLines={4}
        >
          {edital.texto}
        </Text>

        {/* PDF DO EDITAL */}

        {edital.pdf && (
          <TouchableOpacity
            style={styles.linkRow}
            activeOpacity={0.7}
            onPress={() =>
              abrirLink(edital.pdf)
            }
          >
            <Ionicons
              name="document-outline"
              size={22}
              color={colors.greenAccent}
            />

            <Text style={styles.linkText}>
              Abrir PDF do edital
            </Text>
          </TouchableOpacity>
        )}

        {/* FORMULÁRIO */}

        {edital.formulario && (
          <TouchableOpacity
            style={styles.linkRow}
            activeOpacity={0.7}
            onPress={() =>
              abrirLink(edital.formulario)
            }
          >
            <Ionicons
              name="create-outline"
              size={23}
              color={colors.greenAccent}
            />

            <Text style={styles.linkText}>
              Formulário de inscrição
            </Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
  },

  searchContainer: {
    height: 38,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: 13,
    color: '#444',
  },

  listContent: {
    paddingBottom: 90,
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 10,
  },

  bookmarkButton: {
    width: 30,
    alignItems: 'flex-start',
    paddingTop: 2,
  },

  cardContent: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    color: '#222',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },

  description: {
    fontSize: 10,
    lineHeight: 16,
    color: '#C2C2C2',
    marginBottom: 7,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 27,
    gap: 7,
  },

  linkText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#247A35',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
});