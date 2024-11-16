import { StyleSheet, View, StatusBar, FlatList, TouchableOpacity, Image, Text, Keyboard, TextInput } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Book, ClickState, HomeNavigationProp, HomeScreenProps } from '../components/types/types';
import {  useIsFocused  } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export const HomeScreen: React.FC<HomeScreenProps> = ({route, navigation}) => {
  const [books, setBooks] = useState([]);
  const [clickState, setClickState] = useState<ClickState>({});
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { searchPress, refresh } = route?.params || {};

  const toggleSearch = () => {
    if (searchPress) {
      searchPress(); 
    }
    setIsSearchActive(true); 
  };

  const handleCancelSearch = () => {
    setIsSearchActive(false); 
    setSearchText(''); 
    Keyboard.dismiss();
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

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookInformation', { isbn:item.isbn })}
    >
      <View style={styles.bookContainer}>
        {!clickState[item.isbn] ? (
          <View style={styles.bookmark}>
            <TouchableOpacity key={item.isbn} onPress={() => setBookAsRead(item.isbn)}>
              <Ionicons name={'bookmark-outline'} size={32} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookmark}>
            <TouchableOpacity key={item.isbn} onPress={() => setBookAsRead(item.isbn)}>
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
    <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" translucent />
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.isbn}
        />
    </View>
    
  );
};

const styles = StyleSheet.create({
    searchBox: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 10,
        position: 'absolute',
        top: 70, 
        backgroundColor: 'white',
        zIndex: 1, 
      },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
      },
    cancelText: {
        marginTop: 5,
        color: 'blue',
        textAlign: 'right',
        fontSize: 14,
      },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  }, 
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
