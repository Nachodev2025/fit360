import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' }
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Aquí se añadirán más pantallas en el futuro */}
    </Stack.Navigator>
  );
};

export default HomeNavigator; 