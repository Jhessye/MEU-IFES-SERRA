// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsLayout() {
  return (
    <View style={styles.container}>

      {/* ============================================== */}
      {/* HEADER GLOBAL */}
      {/* ============================================== */}

      <LinearGradient
        colors={[
          colors.greenAccent,
          '#7bc284',
          '#f5f8f5',
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
            onPress={() => {
              // Futuramente podemos abrir o menu lateral aqui
            }}
          >
            <Ionicons
              name="menu-outline"
              size={40}
              color={colors.greenDark}
            />
          </TouchableOpacity>

          {/* NOME DO APP */}

          <Text style={styles.headerTitle}>
            Meu Ifes Serra
          </Text>

          {/* ESPAÇO PARA MANTER O TÍTULO CENTRALIZADO */}

          <View style={styles.headerRight} />
        </SafeAreaView>
      </LinearGradient>

      {/* ============================================== */}
      {/* TELAS */}
      {/* ============================================== */}

      <View style={styles.tabsContainer}>
        <Tabs
          screenOptions={{
            headerShown: false,

            tabBarActiveTintColor: colors.greenAccent,
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

          {/* NOTÍCIAS */}

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

          {/* EDITAIS */}

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

          {/* OPORTUNIDADES */}

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

        </Tabs>
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
  },

  // ----------------------------------------------------
  // HEADER
  // ----------------------------------------------------

  headerGradient: {
    height: 120,
    width: '100%',
  },

  header: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,
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

    fontSize: 30,
    marginTop: 2,

    fontWeight: '600',

    color: colors.white,
  },

  headerRight: {
    width: 42,
  },

  // ----------------------------------------------------
  // TABS
  // ----------------------------------------------------

  tabsContainer: {
    flex: 1,
  },
});