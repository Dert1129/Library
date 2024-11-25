import { StyleSheet, View, StatusBar, FlatList, TouchableOpacity, Image, Text, Keyboard, TextInput } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Book, ClickState, HomeNavigationProp, HomeScreenProps } from '../components/types/types';
import {  useIsFocused  } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen: React.FC<HomeScreenProps> = ({route, navigation}) => {
    const [books, setBooks] = useState([]);
    const [clickState, setClickState] = useState<ClickState>({});
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState(books);
    const axiosConfig = {
        headers: {
        'Content-Type': 'application/json',
        },
    };
    const endpoint = process.env.EXPO_PUBLIC_ENDPOINT;

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
        if (route.params?.showSearchBar) {
            setIsSearchVisible(route.params.showSearchBar);
        }
    }, [isFocused, getBooks, 
        route.params?.showSearchBar
    ]);

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
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        const filtered = books.filter((book: Book) => {
            const title = book.title ? book.title.toLowerCase() : "";
            const author = book.authorName ? book.authorName.toLowerCase() : "";
            const genre = book.genre ? book.genre.toLowerCase() : "";
        
            return (
            title.includes(lowerQuery) ||
            author.includes(lowerQuery) ||
            genre.includes(lowerQuery)
            );
        });

        setFilteredBooks(filtered);
    };
    const clearSearchText = () => {
        setSearchQuery('');
        setFilteredBooks(books);
        setIsSearchVisible(false);
        navigation.setParams({showSearchBar: false})
    }

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
            {item.genre? <Text style={styles.bookDetails}>Genre: {item.genre.replace(/[\[\]]/g, "")}</Text> : null}
            </View>
        </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" translucent />
            {isSearchVisible && (
            <View style={styles.searchBarContainer}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by title, author, or genre"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <TouchableOpacity onPress={clearSearchText} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
            </View>
        )}
            <FlatList
            data={filteredBooks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            />
        </View>
        
    );
};

const styles = StyleSheet.create({
    clearButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        marginLeft: 5
    },
    clearButtonText: {
        fontSize: 18,
        color: '#000',
    },
    searchBarContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 5
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
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
    bookDetails: {
        fontSize: 14,
        color: "#555",
    },
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
    bookImage: {
    width: 50,
    height: 100,
    marginRight: 10,
    },
    bookInfo: {
    flex: 1,
    },
});
