import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  useColorScheme,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { fetchUsers, resetUsers } from '../redux/slices/userSlice';
import { Themes } from '../constants/theme';
import { scaleFont, scaleHeight, scaleWidth } from '../constants/metric';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { users, isLoading, page } = useSelector((state: RootState) => state.users);
  const [filter, setFilter] = useState('');

  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Themes.dark.colors : Themes.light.colors;

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
      console.log('Loaded offline data:', JSON.parse(cachedUsers));
    }
  };

  useEffect(() => {
    loadOfflineData();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Filter by country"
        placeholderTextColor={theme.placeholder}
        value={filter}
        onChangeText={setFilter}
      />
      {isLoading && users.length === 0 ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <FlatList
          data={filterUsers}
          keyExtractor={(item, index) => `${item.login.uuid}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.userCard, { backgroundColor: theme.card }]}
              onPress={() => handleUserPress(item)}
            >
              <Image source={{ uri: item.picture.thumbnail }} style={styles.thumbnail} />
              <View>
                <Text style={[styles.name, { color: theme.text }]}>
                  {item.name.first} {item.name.last}
                </Text>
                <Text style={[styles.country, { color: theme.subtext }]}>
                  {item.location.country}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={loadUsers}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshUsers}
              tintColor={theme.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(16),
  },
  searchInput: {
    height: scaleHeight(40),
    borderWidth: scaleWidth(1),
    borderRadius: scaleWidth(20),
    paddingHorizontal: scaleWidth(8),
    marginBottom: scaleHeight(16),
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleHeight(16),
    padding: scaleWidth(10),
    borderRadius: scaleWidth(5),
  },
  thumbnail: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: scaleWidth(25),
    marginRight: scaleWidth(10),
  },
  name: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
  },
  country: {
    fontSize: scaleFont(14),
  },
});

export default HomeScreen;
