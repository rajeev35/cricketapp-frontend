import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import authApi from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function PhoneOtpScreen({ route, navigation }) {
  const { phoneNumber } = route.params;
  const [otp, setOtp]   = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn }      = useAuth();

  const handleVerify = async () => {
    if (!otp) {
      return Alert.alert('Missing OTP', 'Please enter the code you received.');
    }
    setLoading(true);
    try {
      const { data } = await authApi.verifyOtp({ phoneNumber, otp });
      signIn({ token: data.token, displayName: data.displayName });
    } catch (e) {
      Alert.alert('Verification Failed', e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { data } = await authApi.requestOtp({ phoneNumber });
      console.log('🔁 OTP resent (dev):', data.code);
      Alert.alert('OTP Sent', `A new code was sent to ${phoneNumber}`);
    } catch (e) {
      Alert.alert('Resend Failed', e.response?.data?.error || e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.centered}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Verify Your Number</Text>
          <Text style={styles.subText}>{phoneNumber}</Text>
        </View>

        <View style={styles.card}>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            style={styles.otpInput}
            maxLength={6}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleResend} style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive it?</Text>
            <Text style={styles.resendLink}> Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0066cc',
  },
  subText: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
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
    alignItems: 'center',
  },
  otpInput: {
    width: '60%',
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    marginBottom: 32,
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#88b0e0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  resendText: {
    color: '#555',
  },
  resendLink: {
    color: '#0066cc',
    fontWeight: '600',
  },
});
