// src/api/auth.js
import client from './index'

// Email/password
export const register = ({ email, password, displayName }) =>
  client.post('/auth/register', { email, password, displayName })

export const emailLogin = ({ email, password }) =>
  client.post('/auth/email-login', { email, password })

// Phone‐OTP
export const requestOtp = (phone) =>
  client.post('/auth/request-otp', { phoneNumber: phone })

export const verifyOtp = ({ phoneNumber, otp }) =>
  client.post('/auth/verify-otp', { phoneNumber, otp })

// Firebase token exchange
export const loginWithIdToken = (idToken) =>
  client.post('/auth/login', { idToken })

export default {
  register,
  emailLogin,
  requestOtp,
  verifyOtp,
  loginWithIdToken,
}
