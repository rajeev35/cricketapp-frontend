// src/screens/home/ProfileScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const name = user?.displayName || 'Player';

  const handleLogout = () => {
    signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Profile Icon & Name */}
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={96} color="#333" />
          <Text style={styles.name}>{name}</Text>
        </View>

        {/* My Matches Section */}
        <Text style={styles.sectionTitle}>My Matches</Text>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="football-outline" size={20} color="#0066cc" />
          <Text style={styles.optionText}>View Matches</Text>
        </TouchableOpacity>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#333" />
          <Text style={styles.optionText}>Log Out</Text>
        </TouchableOpacity>
      </View>
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
  container: {
    flex: 1,
    padding: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0066cc',
    marginTop: 12,
    marginBottom: 32,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});
