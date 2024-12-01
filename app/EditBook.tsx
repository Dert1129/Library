import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import axios from 'axios';
import { EditBookNavigationProp, EditBookRouteProp, Errors } from '@/components/types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';


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
  const [genre, setGenre] = useState<string[]>(Array.isArray(item.genreList) ? item.genreList : []);
  const [copies, setCopies] = useState(String(item.copies));
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [genreOptions, setGenreOptions] = useState([
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Science Fiction', value: 'Science Fiction' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Young Adult', value: 'Young Adult' },
  ]);


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
      {
        key: 'startDate',
        label: 'Start Date',
        value: startDate,
        error: errors.startDate,
        startDateComponent: (
            <>
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
            </>
         
        )
      },
      {
        key: 'endDate',
        label: 'End Date',
        value: endDate,
        error: errors.endDate,
        endDateComponent: (
            <>
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
            </>
         
        )
      }
  ]


  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="black" translucent />
      <FlatList
        data={formFields}
        keyExtractor={(item) => item.key}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{item.label}</Text>
            {item.error ? <Text style={styles.errorText}>{item.error}</Text> : null}
            {item.customComponent || item.startDateComponent || item.endDateComponent || (
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
            <Button title="Update Book" onPress={handleUpdate} />
          </View>
        }
        contentContainerStyle={styles.contentContainer}
      />
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
    backgroundColor: '#fff'
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
  dropdown: {
    marginTop: 5,
    borderColor: 'gray',
    borderRadius: 5,
  },
  dropdownContainer: {
    borderColor: 'gray',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footer: {
    marginTop: 20,
  },
});
