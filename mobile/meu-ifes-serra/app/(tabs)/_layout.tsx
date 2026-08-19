import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Linking,
  Dimensions,
} from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TabsLayout() {
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);

  // ======================================================
  // MENU
  // ======================================================

  const abrirMenu = () => {
    setMenuVisible(true);
  };

  const fecharMenu = () => {
    setMenuVisible(false);
  };

  const navegar = (rota: string) => {
    setMenuVisible(false);
    router.push(rota as any);
  };

  // ======================================================
  // FALE CONOSCO
  // ======================================================

  const falarConosco = async () => {
    setMenuVisible(false);

    const email = 'desenvolvedores@ifes.edu.br';

    try {
      await Linking.openURL(`mailto:${email}`);
    } catch (error) {
      console.error('Erro ao abrir e-mail:', error);
    }
  };

  return (
    <View style={styles.container}>

      {/* ==================================================
          HEADER GLOBAL
          ================================================== */}

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

          {/* MENU HAMBÚRGUER */}

          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            onPress={abrirMenu}
          >
            <Ionicons
              name="menu-outline"
              size={38}
              color={colors.greenDark}
            />
          </TouchableOpacity>

          {/* NOME DO APP */}

          <Text style={styles.headerTitle}>
            Meu Ifes Serra
          </Text>

          {/* ESPAÇO PARA CENTRALIZAR */}

          <View style={styles.headerRight} />

        </SafeAreaView>
      </LinearGradient>

      {/* ==================================================
          TABS
          ================================================== */}

      <View style={styles.tabsContainer}>

        <Tabs
          screenOptions={{
            headerShown: false,

            tabBarActiveTintColor:
              colors.greenAccent,

            tabBarInactiveTintColor: '#777',

            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
              marginBottom: 3,
            },

            tabBarStyle: {
              height: 85,

              paddingTop: 4,
              paddingBottom: 3,

              backgroundColor: colors.white,

              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',

              elevation: 8,

              shadowColor: '#000',

              shadowOffset: {
                width: 0,
                height: -2,
              },

              shadowOpacity: 0.08,
              shadowRadius: 4,
            },
          }}
        >

          {/* ==================================================
              NOTÍCIAS
              ================================================== */}

          <Tabs.Screen
            name="index"
            options={{
              title: 'Notícias',

              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="newspaper-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          {/* ==================================================
              EDITAIS
              ================================================== */}

          <Tabs.Screen
            name="editais"
            options={{
              title: 'Editais',

              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="document-text-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          {/* ==================================================
              OPORTUNIDADES
              ================================================== */}

          <Tabs.Screen
            name="oportunidades"
            options={{
              title: 'Oportunidades',

              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="briefcase-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          {/* ==================================================
              TELAS DE RECURSOS
              
              Elas existem dentro do Tabs para manter
              o footer, mas NÃO aparecem no footer.
              ================================================== */}

          <Tabs.Screen
            name="perfil"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="configuracoes"
            options={{
              href: null,
            }}
          />

          <Tabs.Screen
            name="salvos"
            options={{
              href: null,
            }}
          />

        </Tabs>

      </View>

      {/* ==================================================
          MENU LATERAL
          ================================================== */}

      {menuVisible && (
        <View style={styles.menuOverlay}>

          {/* ÁREA ESCURA FORA DO MENU */}

          <Pressable
            style={styles.overlayTouchable}
            onPress={fecharMenu}
          />

          {/* MENU */}

          <SafeAreaView
            edges={['top', 'bottom']}
            style={styles.sideMenu}
          >

            {/* ==========================================
                ABAS
                ========================================== */}

            <Text style={styles.sectionTitle}>
              Abas
            </Text>

            <MenuItem
              icon="newspaper"
              label="Notícias"
              onPress={() => navegar('/')}
            />

            <MenuItem
              icon="document-text-outline"
              label="Editais"
              onPress={() => navegar('/editais')}
            />

            <MenuItem
              icon="briefcase-outline"
              label="Oportunidades"
              onPress={() => navegar('/oportunidades')}
            />

            {/* SEPARADOR */}

            <View style={styles.separator} />

            {/* ==========================================
                RECURSOS
                ========================================== */}

            <Text style={styles.sectionTitle}>
              Recursos
            </Text>

            <MenuItem
              icon="person-outline"
              label="Perfil"
              onPress={() => navegar('/perfil')}
            />

            <MenuItem
              icon="settings-outline"
              label="Configurações"
              onPress={() => navegar('/configuracoes')}
            />

            <MenuItem
              icon="chatbubble-outline"
              label="Fale conosco"
              onPress={falarConosco}
            />

          </SafeAreaView>
        </View>
      )}

    </View>
  );
}

// ======================================================
// ITEM DO MENU
// ======================================================

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={onPress}
    >

      <Ionicons
        name={icon}
        size={24}
        color="#292929"
        style={styles.menuIcon}
      />

      <Text style={styles.menuLabel}>
        {label}
      </Text>

    </TouchableOpacity>
  );
}

// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // ====================================================
  // HEADER
  // ====================================================

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

  menuButton: {
    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,

    textAlign: 'center',

    fontSize: 26,

    marginTop: 2,

    fontWeight: '600',

    color: colors.white,
  },

  headerRight: {
    width: 50,
  },

  // ====================================================
  // TABS
  // ====================================================

  tabsContainer: {
    flex: 1,
  },

  // ====================================================
  // MENU LATERAL
  // ====================================================

  menuOverlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    flexDirection: 'row',

    zIndex: 1000,

    elevation: 1000,
  },

  overlayTouchable: {
    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.20)',
  },

  sideMenu: {
    position: 'absolute',

    left: 0,
    top: 0,
    bottom: 0,

    width: width * 0.78,

    backgroundColor: colors.white,

    paddingHorizontal: 12,

    paddingTop: 20,
  },

  sectionTitle: {
    fontSize: 12,

    fontWeight: '500',

    color: '#777',

    marginTop: 12,

    marginBottom: 8,

    paddingHorizontal: 0,
  },

  menuItem: {
    height: 43,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 2,
  },

  menuIcon: {
    width: 30,

    marginRight: 0,
  },

  menuLabel: {
    fontSize: 14,

    color: '#202020',

    fontWeight: '500',
  },

  separator: {
    height: 1,

    backgroundColor: '#E8E8E8',

    marginVertical: 14,
  },
});