import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '../../components/navigation/TabBarIcon';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from '@/hooks/useColorScheme';
import {HomeScreen} from '@/components/Home/home';
import ScanScreen from '@/components/Scan/scan';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
    const colorScheme = useColorScheme();
  
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'barcode' : 'barcode-outline'} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
