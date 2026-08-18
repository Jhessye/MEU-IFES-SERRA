import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import api from '@/app/services/api';

// -----------------------------------------------------
// TIPO DOS DADOS
// -----------------------------------------------------

type Noticia = {
  id: string;
  titulo: string;
  autor: string;
  data: string;
  imagem?: string;
  texto: string;
  link: string;
};

// -----------------------------------------------------
// TELA PRINCIPAL
// -----------------------------------------------------

export default function HomeScreen() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // ---------------------------------------------------
  // BUSCAR NOTÍCIAS
  // ---------------------------------------------------

  useEffect(() => {
    buscarNoticias();
  }, []);

  const buscarNoticias = async () => {
    try {
      setIsLoading(true);

      const response = await api.get('/noticia');

      const dadosRecebidos =
        response.data?.items || response.data;

      setNoticias(dadosRecebidos);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------
  // FILTRO DA PESQUISA
  // ---------------------------------------------------

  const noticiasFiltradas = noticias.filter((item) => {
    const textoBusca = search.toLowerCase().trim();

    if (!textoBusca) return true;

    return (
      item.titulo?.toLowerCase().includes(textoBusca) ||
      item.texto?.toLowerCase().includes(textoBusca)
    );
  });

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.greenAccent}
        />

        <Text style={styles.loadingText}>
          Carregando notícias...
        </Text>
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------
  // TELA
  // ---------------------------------------------------

  return (
    <View style={styles.container}>

      {/* --------------------------------------------- */}
      {/* HEADER */}
      {/* --------------------------------------------- */}

      

      {/* --------------------------------------------- */}
      {/* CONTEÚDO */}
      {/* --------------------------------------------- */}

      <View style={styles.content}>

        {/* PESQUISA */}

        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Valor"
            placeholderTextColor="#C7C7C7"
            style={styles.searchInput}
            returnKeyType="search"
          />

          <Ionicons
            name="search-outline"
            size={15}
            color={colors.red}
            style={styles.searchIcon}
          />
        </View>

        {/* LISTA */}

        <FlatList
          data={noticiasFiltradas}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => (
            <View style={styles.cardSeparator} />
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
            >

              {/* IMAGEM */}

              <Image
                source={{
                  uri:
                    item.imagem ||
                    'https://via.placeholder.com/100x80/EEEEEE/CCCCCC?text=',
                }}
                style={styles.noticiaImage}
              />

              {/* INFORMAÇÕES */}

              <View style={styles.textContainer}>

                <Text
                  style={styles.title}
                  numberOfLines={1}
                >
                  {item.titulo || 'Title'}
                </Text>

                <Text
                  style={styles.description}
                  numberOfLines={2}
                >
                  {item.texto ||
                    'Body text for whatever you’d like to say. Add main takeaway points.'}
                </Text>

                <Text style={styles.date}>
                  {formatarData(item.data)}
                </Text>

              </View>

            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="newspaper-outline"
                size={40}
                color="#CFCFCF"
              />

              <Text style={styles.emptyText}>
                Nenhuma notícia encontrada.
              </Text>
            </View>
          }
        />

      </View>

    </View>
  );
}

// -----------------------------------------------------
// FORMATAR DATA
// -----------------------------------------------------

function formatarData(data: string) {
  if (!data) return '';

  // Se já vier no formato DD/MM/YYYY
  if (data.includes('/')) {
    return data;
  }

  // Se vier YYYY-MM-DD
  const partes = data.split('-');

  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  return data;
}

// -----------------------------------------------------
// ESTILOS
// -----------------------------------------------------

const styles = StyleSheet.create({

  // ---------------------------------------------------
  // CONTAINER
  // ---------------------------------------------------

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
  },

  // ---------------------------------------------------
  // HEADER
  // ---------------------------------------------------

  headerGradient: {
    height: 105,
    width: '100%',
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  menuButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,

    fontSize: 22,
    fontWeight: '600',

    color: colors.white,

    marginLeft: 4,
  },

  headerRight: {
    width: 42,
  },

  // ---------------------------------------------------
  // CONTEÚDO
  // ---------------------------------------------------

  content: {
    flex: 1,

    paddingHorizontal: 14,

    marginTop: -2,
  },

  // ---------------------------------------------------
  // PESQUISA
  // ---------------------------------------------------

  searchContainer: {
    height: 38,

    backgroundColor: colors.white,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#E3E3E3',

    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: 14,
    paddingRight: 12,

    marginBottom: 14,

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

    color: '#555',
  },

  searchIcon: {
    marginLeft: 5,

    fontSize: 18,
  },

  // ---------------------------------------------------
  // LISTA
  // ---------------------------------------------------

  listContent: {
    paddingBottom: 90,
  },

  cardSeparator: {
    height: 12,
  },

  // ---------------------------------------------------
  // CARD
  // ---------------------------------------------------

  card: {
    width: '100%',

    minHeight: 92,

    flexDirection: 'row',

    backgroundColor: colors.white,

    borderWidth: 1,
    borderColor: '#E4E4E4',

    borderRadius: 8,

    padding: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 2,

    elevation: 1,
  },

  noticiaImage: {
    width: 78,
    height: 70,

    borderRadius: 4,

    backgroundColor: '#E7E7E7',
  },

  textContainer: {
    flex: 1,

    marginLeft: 12,

    justifyContent: 'space-between',

    paddingVertical: 1,
  },

  title: {
    fontSize: 14,

    lineHeight: 18,

    fontWeight: '700',

    color: '#333',

    marginBottom: 4,
  },

  description: {
    fontSize: 11,

    lineHeight: 15,

    color: '#777',

    marginBottom: 3,
  },

  date: {
    fontSize: 9,

    lineHeight: 12,

    fontWeight: '600',

    color: '#222',
  },

  // ---------------------------------------------------
  // VAZIO
  // ---------------------------------------------------

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingTop: 80,
  },

  emptyText: {
    marginTop: 12,

    fontSize: 15,

    color: '#999',
  },
});