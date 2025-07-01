// src/screens/home/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { matchesApi, deleteMatch } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { CommonActions, useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut }     = useAuth();
  const navigation             = useNavigation();

  const today = new Date().toDateString();
  const displayName = user?.displayName || 'Player';

  // fetch matches on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await matchesApi.listMatches();
        setMatches(data);
      } catch (err) {
        console.error('List matches error', err);
        Alert.alert('Error', 'Could not load matches');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // determine match status badge
  function getStatus(dateStr) {
    const d = new Date(dateStr).toDateString();
    if (d === today) return { label: 'Today', color: '#ff5b5b' };
    return new Date(dateStr) > new Date()
      ? { label: 'Upcoming', color: '#4caf50' }
      : { label: 'Completed', color: '#999' };
  }

  // confirm & delete
  const confirmDelete = (id) => {
    Alert.alert(
      'Delete match?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMatch(id);
              setMatches((prev) => prev.filter((m) => m._id !== id));
            } catch (err) {
              console.error('Delete failed', err);
              Alert.alert('Error', 'Could not delete match');
            }
          },
        },
      ]
    );
  };

  // render each card
  const renderItem = ({ item }) => {
    const { label, color } = getStatus(item.date);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MatchDetail', { matchId: item._id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.formatRow}>
            <MaterialCommunityIcons name="cricket" size={20} color="#0066cc" />
            <Text style={styles.formatText}>{item.format}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{label}</Text>
          </View>
          <TouchableOpacity onPress={() => confirmDelete(item._id)}>
            <Ionicons name="trash-outline" size={20} color="#c00" />
          </TouchableOpacity>
        </View>

        <Text style={styles.dateText}>
          {new Date(item.date).toLocaleString()}
        </Text>

        <View style={styles.venueRow}>
          <Ionicons name="location-sharp" size={16} color="#666" />
          <Text style={styles.venueText}>{item.location}</Text>
        </View>

        <View style={styles.liveRow}>
          <Ionicons name="stopwatch-outline" size={16} color="#4caf50" />
          <Text style={styles.liveText}>Live score when started</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // logout handler
  const handleLogout = () => {
    signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Matches</Text>
        <TouchableOpacity
          style={styles.profile}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={42} color="#333" />
          <Text style={styles.profileName}>{displayName}</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(m) => m._id}
          renderItem={renderItem}
          contentContainerStyle={
            matches.length === 0 && styles.emptyContainer
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No matches yet. Tap "+" to create one!
            </Text>
          }
        />
      )}

      {/* New Match Button */}
      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => navigation.navigate('CreateMatch')}
      >
        <Ionicons name="add-circle-outline" size={64} color="#0066cc" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f5f9',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : Constants.statusBarHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#0066cc',
  },
  profile: {
    alignItems: 'center',
  },
  profileName: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#0066cc',
    backgroundColor: 'rgba(0,102,204,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    // light shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formatRow: { flexDirection: 'row', alignItems: 'center' },
  formatText: { color: '#0066cc', fontSize: 18, marginLeft: 6 },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12 },

  dateText: {
    color: '#666',
    marginTop: 8,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  venueText: { color: '#666', marginLeft: 4 },

  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  liveText: { color: '#4caf50', marginLeft: 6 },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: '#888', fontSize: 16 },

  newBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
