import './gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import SplashScreen from './src//screens/SplashScreen';
import UserListScreen from './src//screens/HomeScreen';
import UserDetailsScreen from './src/screens/UserDetailsScreen';
import store from './src/redux/store';
import { useColorScheme } from 'react-native';
import { Themes } from './src/constants/theme';

const Stack = createStackNavigator();

const App = () => {
  const scheme = useColorScheme(); // Detect system theme

  return (
    <Provider store={store}>
      <NavigationContainer theme={scheme === 'dark' ? Themes.dark : Themes.light}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="UserList" component={UserListScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
