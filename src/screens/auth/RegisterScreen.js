// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authApi from '../../api/auth';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [loading, setLoading]         = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleRegister = async () => {
    if (!displayName || !email || !password) {
      // you can keep the default Alert here if you like
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ email, password, displayName });
      // show our custom modal instead of an Alert
      setSuccessModal(true);
    } catch (err) {
      // fallback to Alert for error
      Alert.alert(
        'Registration Failed',
        err.response?.data?.error || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModalAndLogin = () => {
    setSuccessModal(false);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.centered}>
        <Text style={styles.header}>Create Account</Text>
        <View style={styles.card}>
          <TextInput
            placeholder="Full Name"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.replace('Login')}
            style={styles.switchRow}
          >
            <Text style={styles.switchText}>Already have an account?</Text>
            <Text style={styles.switchLink}> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={successModal}
        transparent
        animationType="fade"
        onRequestClose={closeModalAndLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={80} color="#28a745" />
            <Text style={styles.modalTitle}>Registration Successful!</Text>
            <Text style={styles.modalMessage}>
              Your account has been created.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={closeModalAndLogin}
            >
              <Text style={styles.modalButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f5f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0066cc',
    marginBottom: 24,
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#88b0e0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchText: {
    color: '#555',
    fontSize: 14,
  },
  switchLink: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 12,
  },
  modalButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
