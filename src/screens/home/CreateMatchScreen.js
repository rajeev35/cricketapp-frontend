// src/screens/home/CreateMatchScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { matchesApi } from '../../api';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function CreateMatchScreen({ navigation }) {
  const [format, setFormat]     = useState('T20');
  const [matchDate, setMatchDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [loading, setLoading]   = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const submit = async () => {
    if (!format || !matchDate || !location) {
      return Alert.alert('Missing fields', 'Please fill out all fields.');
    }
    setLoading(true);
    try {
      // send ISO string
      await matchesApi.createMatch({
        format,
        date: matchDate.toISOString(),
        location,
      });
      Alert.alert(
        '✅ Match Created',
        `Your ${format} match on ${matchDate.toLocaleString()} at "${location}" is live!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('CreateMatch error:', err);
      Alert.alert(
        '❌ Failed to Create',
        err.response?.data?.error || err.message || 'Unknown server error.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = (date) => {
    setMatchDate(date);
    setPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Ionicons name="calendar-outline" size={36} color="#0066cc" />
          <Text style={styles.headerText}>New Match</Text>
        </View>

        <View style={styles.card}>
          {/* Format */}
          <TextInput
            placeholder="Format (e.g. T20 / ODI / Test)"
            value={format}
            onChangeText={setFormat}
            style={styles.input}
          />

          {/* Date picker trigger */}
          <TouchableOpacity
            onPress={() => setPickerVisible(true)}
            style={styles.dateBtn}
          >
            <Text style={styles.dateBtnText}>
              {matchDate.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {/* Location */}
          <TextInput
            placeholder="Location (e.g. Mumbai Ground)"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />

          {/* Create button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={submit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Create Match</Text>}
          </TouchableOpacity>
        </View>

        {/* Modal picker */}
        <DateTimePickerModal
          isVisible={pickerVisible}
          mode="datetime"
          date={matchDate}
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f5f9',
    paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  flex: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0066cc',
    marginLeft: 8,
  },
  card: {
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },
  dateBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dateBtnText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#88b0e0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
