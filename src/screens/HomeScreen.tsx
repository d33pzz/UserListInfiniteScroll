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
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { fetchUsers, resetUsers } from '../redux/slices/userSlice';
import { Themes } from '../constants/theme';
import { scaleFont, scaleHeight, scaleWidth } from '../constants/metric';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { users, isLoading, page } = useSelector((state: RootState) => state.users);

  const [filter, setFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isOffline, setIsOffline] = useState(false); // Track network status

  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? Themes.dark.colors : Themes.light.colors;

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Load users with pagination
  const loadUsers = useCallback(() => {
    if (!isLoading && !isFetchingMore && !isOffline) {
      setIsFetchingMore(true);
      dispatch(fetchUsers(page) as any).finally(() => setIsFetchingMore(false));
    }
  }, [dispatch, isLoading, isFetchingMore, isOffline, page]);

  // Refresh the list
  const refreshUsers = async () => {
    setIsRefreshing(true);
    if (isOffline) {
      setIsRefreshing(false);
      return; // Do nothing if offline
    }
    dispatch(resetUsers());
    await dispatch(fetchUsers(1) as any); // Start with the first page
    setIsRefreshing(false);
  };

  // Cache users for offline access
  useEffect(() => {
    const cacheData = async () => {
      if (!isLoading && users.length > 0) {
        await AsyncStorage.setItem('usersCache', JSON.stringify(users));
      }
    };
    cacheData();
  }, [users, isLoading]);

  // Load cached users when offline
  const loadOfflineData = async () => {
    const cachedUsers = await AsyncStorage.getItem('usersCache');
    if (cachedUsers) {
      console.log('Loaded offline data:', JSON.parse(cachedUsers));
    }
  };

  useEffect(() => {
    loadOfflineData();
  }, []);

  // Filter users based on input
  const filterUsers = users.filter((user) =>
    user.location.country.toLowerCase().includes(filter.toLowerCase())
  );

  // Navigate to user details
  const handleUserPress = (user: any) => {
    navigation.navigate('UserDetails' as never, { user } as never);
  };

  // Trigger API call on scroll near the end
  const handleEndReached = useCallback(() => {
    if (!isLoading && !isFetchingMore && filterUsers.length >= 10 && !isOffline) {
      loadUsers();
    }
  }, [isLoading, isFetchingMore, filterUsers.length, isOffline, loadUsers]);

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
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5} // Trigger when 50% of the remaining list is visible
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshUsers}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: theme.text }]}>
              {isOffline
                ? 'Check the network and pull down to refresh.'
                : 'Pull down to refresh.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          isFetchingMore ? <ActivityIndicator size="small" color={theme.primary} /> : null
        }
      />
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
    width: '98%'
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
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleHeight(20),
  },
  message: {
    fontSize: scaleFont(16),
    textAlign: 'center',
  },
});

export default HomeScreen;
