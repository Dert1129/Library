import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: 'transparent',
        },
      }}
    >
         <Tabs.Screen
      name="AddBook"
      options={{
        tabBarLabel:"Add Book",
        tabBarIcon: ({color, focused}) => (
            <TabBarIcon name='add' color={color}/>  

        ),
        headerShown: true,
        headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            color: 'black',
          },
        headerTitle: "Add Book"
      }} />

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'barcode' : 'barcode-outline'} color={color} />
          ),
          headerShown: false
        }}
      />

      {/* <Tabs.Screen 
        name="BookCarousel"
        options={{
          tabBarLabel: "Shuffle",
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? "menu" : 'menu-outline'} color={color} />
          ),
          headerShown: false
          
        }}
        /> */}
     
    </Tabs>
  );
}
