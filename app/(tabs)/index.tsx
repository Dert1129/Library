import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HomeScreen} from '@/app/home';
import { PaperProvider } from 'react-native-paper';
import { RootStackParamList } from '@/components/types/types';
import ScanScreen from '@/app/(tabs)/scan';
import { BookInformation } from '../BookInformation';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
const Stack = createNativeStackNavigator<RootStackParamList>();


const App = () => {
    const handleSearchPress = () => {
        console.log('Search icon pressed');
      };

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
            component={HomeScreen}
            initialParams={{searchPress: handleSearchPress}}
            options={({ route }) => ({
              headerRight: () => (
                <Ionicons
                  name="search" 
                  size={24} 
                  color="black" 
                  style={{ marginRight: 10 }}
                  onPress={() => {
                    route.params?.searchPress();;
                  }}
                />
              ),
            })}
          />
          <Stack.Screen name="BookInformation" component={BookInformation} />
          <Stack.Screen name="Scan" component={ScanScreen} />
        </Stack.Navigator>
    </PaperProvider>
  );
};

export default App;