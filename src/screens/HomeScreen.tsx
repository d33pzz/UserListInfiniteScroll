import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { fetchUsers, resetUsers } from '../redux/slices/userSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { users, isLoading, page } = useSelector((state: RootState) => state.users);

  const [filter, setFilter] = React.useState('');

  const loadUsers = useCallback(() => {
    dispatch(fetchUsers(page) as any);
  }, [dispatch, page]);

  const refreshUsers = async () => {
    dispatch(resetUsers());
    loadUsers();
  };

  const filterUsers = users.filter((user) =>
    user.location.country.toLowerCase().includes(filter.toLowerCase())
  );

  const handleUserPress = (user: any) => {
    navigation.navigate('UserDetails' as never, { user } as never);
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const cacheData = async () => {
      if (!isLoading && users.length > 0) {
        await AsyncStorage.setItem('usersCache', JSON.stringify(users));
      }
    };
    cacheData();
  }, [users, isLoading]);

  const loadOfflineData = async () => {
    const cachedUsers = await AsyncStorage.getItem('usersCache');
    if (cachedUsers) {
      // Load cached users if offline
      console.log('Loaded offline data:', JSON.parse(cachedUsers));
    }
  };

  useEffect(() => {
    loadOfflineData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Filter by country"
        value={filter}
        onChangeText={setFilter}
      />
      {isLoading && users.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filterUsers}
          keyExtractor={(item, index) => `${item.login.uuid}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.userCard} onPress={() => handleUserPress(item)}>
              <Image source={{ uri: item.picture.thumbnail }} style={styles.thumbnail} />
              <View>
                <Text style={styles.name}>
                  {item.name.first} {item.name.last}
                </Text>
                <Text style={styles.country}>{item.location.country}</Text>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={loadUsers}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshUsers} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
    marginHorizontal: 5,
    width: "98%",
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  country: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
