import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HomeScreen} from '@/app/home';
import { PaperProvider } from 'react-native-paper';
import { RootStackParamList } from '@/components/types/types';
import ScanScreen from '@/app/(tabs)/scan';
import { BookInformation } from '../BookInformation';
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
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BookInformation" component={BookInformation} />
          <Stack.Screen name="Scan" component={ScanScreen} />
        </Stack.Navigator>
    </PaperProvider>
  );
};

export default App;