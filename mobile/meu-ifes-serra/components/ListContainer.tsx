// app/components/ListContainer.tsx
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

// O componente que vai ser "envelopado" pelo container
type ListContainerProps<T> = {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T) => string;
};

export function ListContainer<T>({ data, renderItem, keyExtractor }: ListContainerProps<T>) {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 16,
    paddingBottom: 80, // Espaço para a barra de navegação
    gap: 12, // Espaço entre os cards
  },
});