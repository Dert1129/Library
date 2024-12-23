import { Book, BookInformationNavigationProp, BookInformationRouteProp, ClickState } from "@/components/types/types";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Image } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { interpolate } from "react-native-reanimated";

const { height } = Dimensions.get("window");

const BookCarouselScreen = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [books, setBooks] = useState([]);
  const [clickState, setClickState] = useState<ClickState>({});
  const endpoint = process.env.EXPO_PUBLIC_ENDPOINT;
  const navigation = useNavigation<BookInformationNavigationProp>();
  const axiosConfig = {
    headers: {
    'Content-Type': 'application/json',
    },
};

  const carouselRef = useRef();
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

  }, [getBooks, books, ]);

  const shuffleBooks = () => {
    const randomIndex = Math.floor(Math.random() * books.length);

    Animated.timing(scrollY, {
      toValue: randomIndex * height * 0.2,
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setSelectedBook(books[randomIndex]);
    });
  };

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
    onPress={() => navigation.navigate('BookInformation', { id:item.id })}>
    <View style={styles.bookItem}>
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
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookDetails}>Author: {item.authorName}</Text>
        {item.genreList? <Text style={styles.bookDetails}>Genre: {item.genreList.join(", ")}</Text> : null}
        </View>
    </View>
    </TouchableOpacity>
);

const width = Dimensions.get('window').width;
  // console.log(books)

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          vertical
          width={width}
          height={width/2}
          data={books}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => console.log('current index: ', index)}
          renderItem={renderItem}
          mode='parallax'
          modeConfig={{
            showLength: 2, // Adjust this value if needed
            stackInterval: 30, // For spacing in horizontal-stack mode
          }}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookmark: {
    display: 'flex',
    alignSelf: 'flex-start',
    },
  bookDetails: {
    fontSize: 14,
    color: "#555",
},
  bookItem: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
},
bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
},
  bookImage: {
    width: 50,
    height: 100,
    marginRight: 10,
    },
    bookInfo: {
    flex: 1,
    },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  carouselContainer: {
    height: height * 0.3,
    width: "100%",
    overflow: "hidden",
  },
  bookContainer: {
    height: height * 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  bookText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  shuffleButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
  },
  shuffleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedBookContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e0ffe0",
    borderRadius: 10,
  },
  selectedBookText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default BookCarouselScreen;
