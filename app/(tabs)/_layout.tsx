import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: 'transparent',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'barcode' : 'barcode-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
      name="AddBook"
      options={{
        tabBarLabel:"",
        tabBarIcon: ({color, focused}) => (
            <TabBarIcon name='add' color={color}/>  

        ),
      }} />
    </Tabs>
  );
}
