import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HomeScreen} from '@/app/home';
import { PaperProvider } from 'react-native-paper';
import { RootStackParamList } from '@/components/types/types';
import { BookInformation } from '../BookInformation';
import AddBookScreen from '../AddBook';
const Stack = createNativeStackNavigator<RootStackParamList>();


const App = () => {

  return (
    <PaperProvider>
        <Stack.Navigator 
        initialRouteName='Home'
        screenOptions={{
            headerStyle: {
                backgroundColor: "#fff"
            },
            headerTintColor: "#000",
        }}>
        <Stack.Screen
            name="Home"
            component={HomeScreen} />
          <Stack.Screen 
          name="BookInformation" 
          component={BookInformation} 
          options={{ title: "Book Information"}}/>

          <Stack.Screen 
          name="AddBook" 
          component={AddBookScreen} 
          options={{title: "Add Book"}}/>
        </Stack.Navigator>
    </PaperProvider>
  );
};

export default App;