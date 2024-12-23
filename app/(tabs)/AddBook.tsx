import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRoute } from '@react-navigation/native';
import { AddBookRouteProp } from '@/components/types/types';

const AddBookScreen = () => {
  const route = useRoute<AddBookRouteProp>();
  const defaultItem = {
    title: '',
    category: '',
    isbn: '',
    authorName: '',
    publisher: '',
    genreList: [],
    copies: 0,
    imageLink: '',
    description: '',
  }
  const item = route.params?.item || defaultItem;
  const [title, setTitle] = useState(item.title || "");
  const [category, setCategory] = useState(item.category || "");
  const [isbn, setIsbn] = useState(item.isbn || "");
  const [authorName, setAuthorName] = useState(item.authorName || "");
  const [publisher, setPublisher] = useState(item.publisher || "");
  const [genre, setGenre] = useState<string[]>(item.genreList || []);
  const [copies, setCopies] = useState(item.copies ? item.copies.toString() : "");
  const [imageLink, setImageLink] = useState(item.imageLink || "");
  const [description, setDescrption] = useState(item.description || "");
  const endpoint = process.env.EXPO_PUBLIC_ENDPOINT;

  const [open, setOpen] = useState(false);
  const [genreOptions, setGenreOptions] = useState([
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Science Fiction', value: 'Science Fiction' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Young Adult', value: 'Young Adult' },
  ]);

  const [errors, setErrors] = useState({
    title: '',
    category: '',
    isbn: '',
    authorName: '',
    publisher: '',
    genre: '',
    copies: '',
  });

  const clearFields = () => {
    setTitle('');
    setCategory('');
    setIsbn('');
    setAuthorName('');
    setPublisher('');
    setGenre([]);
    setCopies('');
    setImageLink('');
    setDescrption('');
  };

  const validateFields = () => {
    const newErrors = {
      title: '',
      category: '',
      isbn: '',
      authorName: '',
      publisher: '',
      genre: '',
      copies: '',
    };

    if (!title) newErrors.title = 'Title is required';
    if (!category) newErrors.category = 'Category is required';
    if (!isbn) newErrors.isbn = 'ISBN is required';
    if (!authorName) newErrors.authorName = 'Author name is required';
    if (!publisher) newErrors.publisher = 'Publisher is required';
    if (!genre.length) newErrors.genre = 'Genre is required';
    if (!copies || isNaN(Number(copies)) || Number(copies) <= 0 || !Number.isInteger(Number(copies))) {
      newErrors.copies = 'Copies must be a positive whole number';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
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
      imageLink,
      description,
      copies: Number(copies),
    };

    try {
      const response = await axios.post(`http://${endpoint}:3030/api/addManual`, bookData);
      if (response.data === 'Book could not be found') {
        Alert.alert('Error', 'Book could not be found');
      } else {
        Alert.alert('Success', 'Book information has been saved!');
        setTitle('');
        setCategory('');
        setIsbn('');
        setAuthorName('');
        setPublisher('');
        setGenre([]);
        setCopies('');
        setImageLink('');
        setDescrption('');
        setErrors({
          title: '',
          category: '',
          isbn: '',
          authorName: '',
          publisher: '',
          genre: '',
          copies: '',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save book information. Please try again.');
      console.error(error);
    }
  };

  const formFields = [
    {
      key: 'title',
      label: 'Title',
      value: title,
      onChangeText: setTitle,
      placeholder: 'Enter book title',
      error: errors.title,
    },
    {
      key: 'category',
      label: 'Category',
      value: category,
      onChangeText: setCategory,
      placeholder: 'Enter book category',
      error: errors.category,
    },
    {
      key: 'isbn',
      label: 'ISBN',
      value: isbn,
      onChangeText: setIsbn,
      placeholder: 'Enter ISBN',
      error: errors.isbn,
    },
    {
      key: 'authorName',
      label: 'Author Name',
      value: authorName,
      onChangeText: setAuthorName,
      placeholder: 'Enter author name',
      error: errors.authorName,
    },
    {
      key: 'publisher',
      label: 'Publisher',
      value: publisher,
      onChangeText: setPublisher,
      placeholder: 'Enter publisher',
      error: errors.publisher,
    },
    {
      key: 'genre',
      label: 'Genre',
      customComponent: (
        <DropDownPicker
          open={open}
          value={genre}
          items={genreOptions}
          setOpen={setOpen}
          setValue={setGenre}
          setItems={setGenreOptions}
          multiple={true}
          placeholder="Select genre(s)"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          mode='BADGE'
          badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
          dropDownDirection="TOP"
        />
      ),
      error: errors.genre,
    },
    {
      key: 'copies',
      label: 'Copies',
      value: copies,
      onChangeText: setCopies,
      placeholder: 'Enter number of copies',
      error: errors.copies,
    },
  ];

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />
      <FlatList
        data={formFields}
        keyExtractor={(item) => item.key}
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{item.label}</Text>
            {item.error ? <Text style={styles.errorText}>{item.error}</Text> : null}
            {item.customComponent || (
              <TextInput
                style={styles.input}
                value={item.value}
                onChangeText={item.onChangeText}
                placeholder={item.placeholder}
                
              />
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
            <Text style={styles.clearButtonText}>Clear Fields</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.clearButtonText}>Save Book</Text>
          </TouchableOpacity>
        </View>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </GestureHandlerRootView>
  );
};

export default AddBookScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  dropdown: {
    marginTop: 5,
    borderColor: 'gray',
    borderRadius: 5,
  },
  dropdownContainer: {
    borderColor: 'gray',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: "45%",
    justifyContent: "center",
    alignItems: "center"
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: "45%",
    justifyContent: "center",
    alignItems: "center"
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
