import './gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import SplashScreen from './src//screens/SplashScreen';
import UserListScreen from './src//screens/HomeScreen';
import UserDetailsScreen from './src//screens/UserDetailsScreen';
import store from './src/redux/store';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'Users', headerShown: false }} />
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} options={{ title: 'User Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
