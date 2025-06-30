// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../api'; // the axios client

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load stored JWT on mount
//   useEffect(() => {
//     AsyncStorage.getItem('userToken')
//       .then(stored => {
//         if (stored) {
//           setToken(stored);
//           api.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
//         }
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   // Sign in: persist & apply header
//   const signIn = async (newToken) => {
//     await AsyncStorage.setItem('userToken', newToken);
//     api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//     setToken(newToken);
//   };

//   // Sign out: clear storage & header
//   const signOut = async () => {
//     await AsyncStorage.removeItem('userToken');
//     delete api.defaults.headers.common['Authorization'];
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, loading, signIn, signOut }}>
//       {loading ? null : children}
//     </AuthContext.Provider>
//   );
// };

// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user,  setUser ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('userToken');
      const n = await AsyncStorage.getItem('userName');
      if (t) {
        setToken(t);
        api.defaults.headers.common.Authorization = `Bearer ${t}`;
      }
      if (n) setUser({ displayName: n });
      setLoading(false);
    })();
  }, []);

  const signIn = async ({ token: t, displayName }) => {
    await AsyncStorage.setItem('userToken', t);
    await AsyncStorage.setItem('userName', displayName);
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
    setToken(t);
    setUser({ displayName });
  };
   
  const signOut = async () => {
    await AsyncStorage.multiRemove(['userToken','userName']);
    delete api.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, signIn, signOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}
