// HomeScreen.tsx
import { StyleSheet, View, StatusBar } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import BookList from '@/components/Book/BookList';
import { Book, ClickState, HomeScreenProps, RootStackParamList } from '../types/types';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';

export const HomeScreen: React.FC<HomeScreenProps> => ({navigation}) { 
  const [books, setBooks] = useState([]);
  const [clickState, setClickState] = useState<ClickState>({});
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const getBooks = useCallback(() => {
    axios.get('http://192.168.1.203:3030/api/books').then((res) => {
      const sortBooks = res.data.sort((a: Book, b: Book) => a.title.localeCompare(b.title));
      setBooks(sortBooks);
      const initialClickState: ClickState = {};
      res.data.forEach((book: Book) => {
        initialClickState[book.isbn] = book.isRead === true;
      });
      setClickState(initialClickState);
    });
  }, []);

  const isFocused = useIsFocused();
  console.log("Is homepage focused? " + isFocused);


  useEffect(() => {
    if (isFocused) {
      getBooks();
    } else {
      console.log('HomeScreen is unfocused'); 
    }
  }, [isFocused, getBooks]);
  

  const setBookAsRead = (isbn: string): void => {
    const currentRead = clickState[isbn] ? 1 : 0;
    const newRead = currentRead === 1 ? 0 : 1;
    setClickState((prevState: any) => ({
      ...prevState,
      [isbn]: newRead === 1,
    }));

    axios
      .post('http://192.168.1.203:3030/api/markRead', { isbn: isbn, read: newRead }, axiosConfig)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />
      <BookList setBookAsRead={setBookAsRead} clickState={clickState} books={books} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Adds space for the status bar and notifications
  },
});
