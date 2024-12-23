import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { Themes } from '../constants/theme';
import { scaleFont, scaleHeight } from '../constants/metric';

const SplashScreen = ({ navigation }: any) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Themes.dark.colors : Themes.light.colors;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('UserList'); // Navigate to the UserList screen
    }, 2000); // Simulate a 2-second splash delay

    return () => clearTimeout(timer); // Clear timer on unmount
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>UserList Infinite Scroll</Text>
      <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      <Text style={[styles.subtitle, { color: theme.text }]}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
    marginBottom: scaleHeight(16),
  },
  loader: {
    marginVertical: scaleHeight(16),
  },
  subtitle: {
    fontSize: scaleFont(16),
  },
});

export default SplashScreen;
