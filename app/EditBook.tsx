import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { EditBookNavigationProp, EditBookRouteProp, Errors } from '@/components/types/types';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';


const EditBookScreen  = () => {
  const navigation = useNavigation<EditBookNavigationProp>();
  const route = useRoute<EditBookRouteProp>();
  const { item } = route.params;
  const endpoint = process.env.EXPO_PUBLIC_ENDPOINT
  const [id, setId] = useState(item.id);
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [isbn, setIsbn] = useState(item.isbn);
  const [authorName, setAuthorName] = useState(item.authorName);
  const [publisher, setPublisher] = useState(item.publisher);
  const [genre, setGenre] = useState(item.genre);
  const [copies, setCopies] = useState(String(item.copies));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);


  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

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
    if(startDate.getTime() > endDate.getTime()) {
        newErrors.startDate = "Start date must be less than or equal to the end date"
        newErrors.endDate = "End date must be greater than or equal to the start date"
    }

  
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    setStartDateOpen(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };

    const updatedBookData = {
        id, 
        title,
        category,
        isbn,
        authorName,
        genre,
        publisher,
        copies: Number(copies),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      };

    try {
      const response = await axios.post(`http://${endpoint}:3030/api/editBook`, updatedBookData, axiosConfig);
      if (response.data === "Updated book") {
        Alert.alert('Success', 'Book information has been updated!');
        navigation.navigate("BookInformation", {id: item.id}); 
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update book information. Please try again.');
      console.error(error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
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

          <Text style={styles.label}>Start Date</Text>
          {errors.startDate ? <Text style={styles.errorText}>{errors.startDate}</Text> : null}
          <TouchableOpacity onPress={() => setStartDateOpen(true)}>
            <Text style={styles.dateText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={startDateOpen}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={() => setStartDateOpen(false)}
            style={styles.calendar}
          />

          <Text style={styles.label}>End Date</Text>
          {errors.endDate ? <Text style={styles.errorText}>{errors.endDate}</Text> : null}
          <TouchableOpacity onPress={() => setEndDateOpen(true)}>
            <Text style={styles.dateText}>{endDate.toDateString()}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={endDateOpen}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={() => setEndDateOpen(false)}
            style={styles.calendar}
          />

          <Text style={styles.label}>Publisher</Text>
          {errors.publisher ? <Text style={styles.errorText}>{errors.publisher}</Text> : null}
          <TextInput style={styles.input} value={publisher} onChangeText={setPublisher} placeholder="Enter publisher" />

          <Text style={styles.label}>Genre</Text>
          {errors.genre ? <Text style={styles.errorText}>{errors.genre}</Text> : null}
          <TextInput style={styles.input} value={genre} onChangeText={setGenre} placeholder="Enter book genre" />

          <Text style={styles.label}>Copies</Text>
          {errors.copies ? <Text style={styles.errorText}>{errors.copies}</Text> : null}
          <TextInput style={styles.input} value={copies} onChangeText={setCopies} placeholder="Enter number of copies" keyboardType="numeric" />

          <Button title="Update Book" onPress={handleUpdate} />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default EditBookScreen;

const styles = StyleSheet.create({
   calendar: {
    width: 1000
   },
    dateText: {
        height: 40,
        paddingHorizontal: 10,
        marginTop: 5,
        lineHeight: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
      },
  rootContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
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
