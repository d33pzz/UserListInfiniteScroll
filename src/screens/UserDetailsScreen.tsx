import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const UserDetailsScreen = ({ route }: any) => {
  const { user } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.picture.large }} style={styles.profileImage} />
      <Text style={styles.name}>
        {user.name.title} {user.name.first} {user.name.last}
      </Text>
      <Text style={styles.email}>{user.email}</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text style={styles.text}>
          {user.location.street.number} {user.location.street.name},{'\n'}
          {user.location.city}, {user.location.state},{'\n'}
          {user.location.country} - {user.location.postcode}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.text}>Phone: {user.phone}</Text>
        <Text style={styles.text}>Cell: {user.cell}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Info</Text>
        <Text style={styles.text}>Username: {user.login.username}</Text>
        <Text style={styles.text}>Nationality: {user.nat}</Text>
        <Text style={styles.text}>Date of Birth: {new Date(user.dob.date).toLocaleDateString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  section: {
    width: '100%',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default UserDetailsScreen;
