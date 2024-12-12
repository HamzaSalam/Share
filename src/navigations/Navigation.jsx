import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../utils/NavigationUtil';
import SplachScreen from '../screens/SplachScreen';
import HomeScreen from '../screens/HomeScreen';
import {StatusBar} from 'react-native';

const Navigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="SplachScreen"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplachScreen" component={SplachScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navigation;
