import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, StatusBar } from 'react-native';
import axios from 'axios';
import { Errors } from '@/components/types/types';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

const AddBookScreen = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isbn, setIsbn] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [copies, setCopies] = useState('');

  const [errors, setErrors] = useState<Errors>({
    title: '',
    category: '',
    isbn: '',
    authorName: '',
    publisher: '',
    genre: '',
    copies: '',
    startDate: '',
    endDate: '',
  });


  const validateFields = () => {
    const newErrors: Errors = {
      title: '',
      category: '',
      isbn: '',
      authorName: '',
      publisher: '',
      genre: '',
      copies: '',
      startDate: '',
      endDate: '',
    };

    if (!title) newErrors.title = 'Title is required';
    if (!category) newErrors.category = 'Category is required';
    if (!isbn) newErrors.isbn = 'ISBN is required';
    if (!authorName) newErrors.authorName = 'Author name is required';
    if (!publisher) newErrors.publisher = 'Publisher is required';
    if (!genre) newErrors.genre = 'Genre is required';
    if (!copies || isNaN(Number(copies)) || Number(copies) <= 0 || !Number.isInteger(Number(copies))) {
        newErrors.copies = 'Copies must be a positive whole number';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === ''); 
  };


  const handleSubmit = async () => {
    if (!validateFields()) return; 

    const bookData = {
      title,
      category,
      isbn,
      authorName,
      publisher,
      genre,
      copies: Number(copies),
    };

    try {
      const response = await axios.post('http://192.168.1.203:3030/api/addManual', bookData);
      if (response.data === "Book could not be found") {
        Alert.alert('Error', 'Book could not be found');
      }else{
        Alert.alert('Success', 'Book information has been saved!');
        setTitle('');
        setCategory('');
        setIsbn('');
        setAuthorName('');
        setPublisher('');
        setGenre('');
        setCopies('');
        setErrors({
          title: '',
          category: '',
          isbn: '',
          authorName: '',
          publisher: '',
          genre: '',
          copies: '',
          startDate: '',
          endDate: '',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save book information. Please try again.');
      console.error(error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
        <StatusBar barStyle="light-content" backgroundColor="black" translucent />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.label}>Title</Text>
                {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter book title" />

                <Text style={styles.label}>Category</Text>
                {errors.category ? <Text style={styles.errorText}>{errors.category}</Text> : null}
                <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Enter book category" />

                <Text style={styles.label}>ISBN</Text>
                {errors.isbn ? <Text style={styles.errorText}>{errors.isbn}</Text> : null}
                <TextInput style={styles.input} value={isbn} onChangeText={setIsbn} placeholder="Enter ISBN" keyboardType="numeric" />

                <Text style={styles.label}>Author Name</Text>
                {errors.authorName ? <Text style={styles.errorText}>{errors.authorName}</Text> : null}
                <TextInput style={styles.input} value={authorName} onChangeText={setAuthorName} placeholder="Enter author name" />

                <Text style={styles.label}>Publisher</Text>
                {errors.publisher ? <Text style={styles.errorText}>{errors.publisher}</Text> : null}
                <TextInput style={styles.input} value={publisher} onChangeText={setPublisher} placeholder="Enter publisher" />

                <Text style={styles.label}>Genre</Text>
                {errors.genre ? <Text style={styles.errorText}>{errors.genre}</Text> : null}
                <TextInput style={styles.input} value={genre} onChangeText={setGenre} placeholder="Enter book genre" />

                <Text style={styles.label}>Copies</Text>
                {errors.copies ? <Text style={styles.errorText}>{errors.copies}</Text> : null}
                <TextInput style={styles.input} value={copies} onChangeText={setCopies} placeholder="Enter number of copies" keyboardType="numeric" />

                <Button title="Save Book" onPress={handleSubmit} />
            </View>
        </ScrollView>
    </GestureHandlerRootView>
    
    
  );
};

export default AddBookScreen;

const styles = StyleSheet.create({
  rootContainer: {
      flex: 1,
      marginTop: "auto"
    },
    scrollContainer: {
      flexGrow: 1,
    },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    overflow: "scroll"
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
});
