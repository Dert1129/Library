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

  const endpoint = process.env.EXPO_PUBLIC_ENDPOINT;
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [image, setImage] = useState('');
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
    axios.get(`http://${endpoint}:3030/api/books`).then((res) => {
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
//   console.log("Is homepage focused? " + isFocused);

  const handleImage = (imageLink: string) => {
    if (imageLink == null || imageLink.length == 0){
        return <Image source={require("@/assets/images/book-not-found.png")} style={styles.bookImage} />
    }else{
        return <Image source={{uri: imageLink}} style={styles.bookImage} />
    }
  }



  useEffect(() => {
    if (isFocused) {
      getBooks();
    }
  }, [isFocused, getBooks]);
  

  const setBookAsRead = (id: number): void => {
    const currentRead = clickState[id] ? 1 : 0;
    const newRead = currentRead === 1 ? 0 : 1;
    setClickState((prevState: any) => ({
      ...prevState,
      [id]: newRead === 1,
    }));

    axios
      .post(`http://${endpoint}:3030/api/markRead`, { id: id, read: newRead }, axiosConfig)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookInformation', { id:item.id })}
    >
      <View style={styles.bookContainer}>
        {!clickState[item.id] ? (
          <View style={styles.bookmark}>
            <TouchableOpacity key={item.id} onPress={() => setBookAsRead(item.id)}>
              <Ionicons name={'bookmark-outline'} size={32} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookmark}>
            <TouchableOpacity key={item.id} onPress={() => setBookAsRead(item.id)}>
              <Ionicons name={'bookmark'} size={32} />
            </TouchableOpacity>
          </View>
        )}
        {handleImage(item.imageLink)}
        <View style={styles.bookInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>Author: {item.authorName}</Text>
          {item.genre? <Text style={styles.author}>Genre: {item.genre.replace(/[\[\]]/g, "")}</Text> : null}
          
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
          keyExtractor={(item) => item.id.toString()}
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
