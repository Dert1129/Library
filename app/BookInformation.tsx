import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { BookInformationNavigationProp, BookInformationRouteProp } from "@/components/types/types";
import { List } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";

export const BookInformation = () => {
    const navigation = useNavigation<BookInformationNavigationProp>();
  const route = useRoute<BookInformationRouteProp>();
  const {item } = route.params;
  const [expanded, setExpanded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);
  const handleDescPress = () => setDescExpanded(!descExpanded);
  const axiosConfig = {
    headers: {
        "Content-Type": "application/json"
        }
    }
  const handleDeletePress = (isbn: string) => {
    Alert.alert(
      "Delete Book?", 
      "Are you sure you want to delete this book?", 
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            deleteBook(isbn)
          },
        },
      ],
      { cancelable: true }
    );
  };

  const deleteBook = (isbn: string) => {
    axios.delete("http://192.168.1.203:3030/api/deleteBook", {
      data: { isbn },
    })
    .then((res) => {
      if (res.status === 200){
        navigation.navigate("Home", {refresh: true});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.bookContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.imageLink }} style={styles.bookImage} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.authorName}</Text>
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
            <List.Item titleStyle={styles.accordionItem} title={`ISBN: ${item.isbn}`} />
            <List.Item titleStyle={styles.accordionItem} title={`Publisher: ${item.publisher}`} />
            <List.Item titleStyle={styles.accordionItem} title={`Genre: ${item.genre}`} />
            <List.Item titleStyle={styles.accordionItem} title={`Category: ${item.category}`} />
            <List.Item titleStyle={styles.accordionItem} title={`Copies: ${item.copies}`} />
            <List.Item titleStyle={styles.accordionItem} title={`Read? ${item.read === 1 ? 'Yes' : 'No'}`} />
          </List.Accordion>
          <List.Accordion
            title="Description"
            expanded={descExpanded}
            onPress={handleDescPress}
            style={styles.accordionHeader}
            titleStyle={styles.accordionTitle}
          >
              <Text>{item.description}</Text>
          </List.Accordion>
        </List.Section>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.editButton]}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePress(item.isbn)} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
        
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
