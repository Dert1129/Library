import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, BookListProps } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types'; // Ensure correct import for RootStackParamList

type BookInformationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookInformation'>;

const BookList: React.FC<BookListProps> = ({ books, setBookAsRead, clickState }) => {
  const navigation = useNavigation<BookInformationNavigationProp>();

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookInformation', { item })} // Navigate with 'item' as parameter
    >
      <View style={styles.bookContainer}>
        {!clickState[item.isbn] ? (
          <View style={styles.bookmark}>
            <TouchableOpacity key={item.isbn} onPress={() => setBookAsRead(item.isbn, 1)}>
              <Ionicons name={'bookmark-outline'} size={32} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookmark}>
            <TouchableOpacity key={item.isbn} onPress={() => setBookAsRead(item.isbn, 0)}>
              <Ionicons name={'bookmark'} size={32} />
            </TouchableOpacity>
          </View>
        )}
        <Image source={{ uri: item.imageLink }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>Author: {item.authorName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={books}
      renderItem={renderItem}
      keyExtractor={(item) => item.isbn}
    />
  );
};

const styles = StyleSheet.create({
  bookmark: {
    display: 'flex',
    alignSelf: 'flex-start',
  },
  author: {
    color: '#6c757d',
    fontSize: 16,
  },
  bookContainer: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    margin: 1,
  },
  bookImage: {
    width: 50,
    height: 100,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 23,
  },
});

export default BookList;
