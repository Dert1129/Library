// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HomeScreen} from '@/components/Home/home';
import {BookInformation} from '@/components/Book/BookInformation';
import { PaperProvider } from 'react-native-paper';
import { RootStackParamList } from '@/components/types/types';
import ScanScreen from '@/components/Scan/scan';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="BookInformation"
            component={BookInformation}
            options={{ title: 'Book Information' }}
          />
          <Stack.Screen name="Scan" component={ScanScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
