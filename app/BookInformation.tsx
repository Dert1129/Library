import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Book, BookInformationNavigationProp, BookInformationRouteProp } from "@/components/types/types";
import { List } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "expo-router";
import { useRoute, useFocusEffect, useIsFocused } from "@react-navigation/native";

export const BookInformation = () => {
  const endpoint = process.env.EXPO_PUBLIC_ENDPOINT
  const navigation = useNavigation<BookInformationNavigationProp>();
  const route = useRoute<BookInformationRouteProp>();
  const { id } = route.params;

  const [bookData, setBookData] = useState<Book | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);
  const handleDescPress = () => setDescExpanded(!descExpanded);

  const fetchBookData = async () => {
    try {
      const response = await axios.get(`http://${endpoint}:3030/api/getBook?id=${id}`);
      if (response.status === 200 && response.data) {
        setBookData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch book data:", error);
    }
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchBookData();
    } else {
    }
  }, [isFocused]);

  const handleDeletePress = (id: number) => {
    Alert.alert(
      "Delete Book?",
      "Are you sure you want to delete this book?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            deleteBook(id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const deleteBook = async (id: number) => {
    try {
      const response = await axios.delete(`http://${endpoint}:3030/api/deleteBook`, {
        data: { id },
      });
      if (response.status === 200) {
        navigation.navigate("Home", { refresh: true });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleEditPress = (book: Book | null) => {
    if (book) {
      navigation.navigate("EditBook", { item: book });
    }
  };

  if (!bookData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading book information...</Text>
      </View>
    );
  }

  const handleImage = (imageLink: string) => {
    if (imageLink == null || imageLink.length == 0){
        return <Image source={require("@/assets/images/book-not-found.png")} style={styles.bookImage} />
    }else{
        return <Image source={{uri: imageLink}} style={styles.bookImage} />
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.bookContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            {handleImage(bookData.imageLink)}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{bookData.title}</Text>
            <Text style={styles.author}>{bookData.authorName}</Text>
          </View>
        </View>

        <List.Section style={styles.accordionSection}>
          <List.Accordion
            title="More Information"
            expanded={expanded}
            onPress={handlePress}
            style={styles.accordionHeader}
            titleStyle={styles.accordionTitle}
          >
            <List.Item titleStyle={styles.accordionItem} title={`ISBN: ${bookData.isbn}`} />
            <List.Item titleStyle={styles.accordionItem} title={`Publisher: ${bookData.publisher}`} />
            {bookData.genre? <List.Item titleStyle={styles.accordionItem} title={`Genre: ${bookData.genre.replace(/[\[\]]/g, "")}`} /> : null}
            <List.Item titleStyle={styles.accordionItem} title={`Category: ${bookData.category}`} />
            {bookData.startDate? <List.Item titleStyle={styles.accordionItem} title={`Start Date: ${bookData.startDate}`} /> : <List.Item titleStyle={styles.accordionItem} title={`Start Date: Not recorded`} />}
            {bookData.endDate? <List.Item titleStyle={styles.accordionItem} title={`End Date: ${bookData.endDate}`} />: <List.Item titleStyle={styles.accordionItem} title={`End Date: Not recorded`} />}
            <List.Item titleStyle={styles.accordionItem} title={`Copies: ${bookData.copies}`} />
            <List.Item titleStyle={styles.accordionItem} title={`Read? ${bookData.read === 1 ? "Yes" : "No"}`} />
          </List.Accordion>
          <List.Accordion
            title="Description"
            expanded={descExpanded}
            onPress={handleDescPress}
            style={styles.accordionHeader}
            titleStyle={styles.accordionTitle}
          >
            <Text>{bookData.description}</Text>
          </List.Accordion>
        </List.Section>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleEditPress(bookData)} style={[styles.button, styles.editButton]}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePress(bookData.id)} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        width: '45%',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    editButton: {
        backgroundColor: '#007BFF',
    },
    deleteButton: {
        backgroundColor: '#FF0000',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    accordionItem: {
        color: 'black',
    },
    accordionTitle: {
        color: 'black',
    },
    accordionSection: {
        backgroundColor: 'white',
    },
    accordionHeader: {
        backgroundColor: 'white',
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    bookContainer: {
        width: '95%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        flexDirection: 'column',
        top: "2%"
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        marginRight: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 5,
    },
    bookImage: {
        width: 100,
        height: 150,
        borderRadius: 5,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    author: {
        color: "black",
        fontSize: 16,
        marginTop: 4,
    },
    descriptionScroll: {
        maxHeight: 200,
        paddingVertical: 10,
    },
});
