import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, useColorScheme } from 'react-native';
import { Themes } from '../constants/theme';
import { scaleFont, scaleHeight, scaleWidth } from '../constants/metric';

const UserDetailsScreen = ({ route }: any) => {
  const { user } = route.params;
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Themes.dark.colors : Themes.light.colors;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: user.picture.large }} style={styles.profileImage} />
      <Text style={[styles.name, { color: theme.text }]}>
        {user.name.title} {user.name.first} {user.name.last}
      </Text>
      <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Address</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          {user.location.street.number} {user.location.street.name},{'\n'}
          {user.location.city}, {user.location.state},{'\n'}
          {user.location.country} - {user.location.postcode}
        </Text>
      </View>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact</Text>
        <Text style={[styles.text, { color: theme.text }]}>Phone: {user.phone}</Text>
        <Text style={[styles.text, { color: theme.text }]}>Cell: {user.cell}</Text>
      </View>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Other Info</Text>
        <Text style={[styles.text, { color: theme.text }]}>Username: {user.login.username}</Text>
        <Text style={[styles.text, { color: theme.text }]}>Nationality: {user.nat}</Text>
        <Text style={[styles.text, { color: theme.text }]}>
          Date of Birth: {new Date(user.dob.date).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: scaleWidth(16),
    alignItems: 'center',
  },
  profileImage: {
    width: scaleWidth(120),
    height: scaleHeight(120),
    borderRadius: scaleWidth(60),
    marginBottom: scaleHeight(16),
  },
  name: {
    fontSize: scaleFont(22),
    fontWeight: 'bold',
    marginBottom: scaleHeight(8),
  },
  email: {
    fontSize: scaleFont(16),
    marginBottom: scaleHeight(16),
  },
  section: {
    width: '100%',
    marginBottom: scaleHeight(16),
    padding: scaleWidth(10),
    borderRadius: scaleWidth(5),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: scaleHeight(8),
  },
  text: {
    fontSize: scaleFont(16),
    lineHeight: scaleHeight(24),
  },
});

export default UserDetailsScreen;
