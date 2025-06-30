import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import authApi from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Missing fields', 'Please enter email & password.');
    }
    setLoading(true);
    try {
      const { data } = await authApi.emailLogin({ email, password });
      signIn({ token: data.token, displayName: data.displayName });
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    if (!phone) {
      return Alert.alert('Missing field', 'Please enter your phone number.');
    }
    // navigate to OTP screen or call requestOtp here...
    navigation.navigate('PhoneOtp', { phoneNumber: phone });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Ionicons name="ios-baseball" size={48} color="#0066cc" />
          <Text style={styles.title}>CricketApp</Text>
        </View>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'email' && styles.activeToggle]}
            onPress={() => setMode('email')}
          >
            <Text style={[styles.toggleText, mode === 'email' && styles.activeToggleText]}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'phone' && styles.activeToggle]}
            onPress={() => setMode('phone')}
          >
            <Text style={[styles.toggleText, mode === 'phone' && styles.activeToggleText]}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {mode === 'email' ? (
            <>
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleEmailLogin}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.submitText}>Log In</Text>
                }
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                placeholder="Enter Phone no"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handlePhoneLogin}>
                <Text style={styles.submitText}>Send OTP</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.switchLink}
            onPress={() =>
              mode === 'email'
                ? navigation.navigate('Register')
                : setMode('email')
            }
          >
            <Text style={styles.switchText}>
              {mode === 'email'
                ? "Don't have an account? Register"
                : 'Back to Email Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f5f9',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    color: '#0066cc',
    fontWeight: '700',
    marginTop: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#e0e5eb',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 24,
  },
  toggleBtn: {
    width: width * 0.4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: {
    color: '#555',
    fontSize: 16,
  },
  activeToggle: {
    backgroundColor: '#0066cc',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: '600',
  },
  form: {
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
  submitBtn: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    color: '#0066cc',
    fontSize: 14,
  },
});
