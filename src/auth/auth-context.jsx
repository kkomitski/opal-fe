import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from "firebase/auth";
// import { auth } from "./auth/firebase-config";
import cryptoJs from "crypto-js";
import idleTimeout from "idle-timeout";
import { auth } from "./firebase-config";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Provider with all the user operations
export function AuthProvider({ children }) {
  const [loggedUser, setLoggedUser] = useState(null);
  const [persistance, setPersistance] = useState(false);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password, isPersistant) {
    // isPersistant takes a radio input from the login page that results in the user login being persistant if set to true
    setPersistance(isPersistant);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function reset(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email) {
    return updateEmail(loggedUser, email);
  }

  function updateUserPassword(password) {
    return updatePassword(loggedUser, password);
  }

  // Checks user login persistance preferences
  function checkUser(window) {
    console.log(window);
    if (window.localStorage.encuser) {
      // If persistance was requested save encrypted details to local storage and serve
      const key = process.env.NEXT_PUBLIC_CRYPT_KEY;
      const bytes = cryptoJs.AES.decrypt(window.localStorage.encuser, key);
      const user = JSON.parse(bytes.toString(cryptoJs.enc.Utf8));
      return user;
    } else if (loggedUser) {
      // If persistance was rejected only serve from state memory
      return loggedUser;
    } else {
      // Reject
      return false;
    }
  }

  // On first render start a authentication state change listener
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // Generate an idle timer that would logout and clear all stored data on expiry
      const timeout = idleTimeout(
        () => {
          setLoggedUser(false);
          window.localStorage.removeItem("encuser");
        },
        { element: document, timeout: 15 * 60 * 1000, loop: false }
      );
      timeout.pause();

      // If listener returns a user, encrypt user data and save to local storage
      if (user) {
        setLoggedUser(user);

        if (persistance) {
          // Encrypt and save to local storage
          const cipher = cryptoJs.AES.encrypt(JSON.stringify(user), process.env.NEXT_PUBLIC_CRYPT_KEY).toString();
          window.localStorage.setItem("encuser", cipher);
        }

        // Timeout session (currently 15 minutes)
        timeout.resume();
      } else {
        // If listener returns null - log out and delete user data from local storage
        window.localStorage.removeItem("encuser");
        timeout.destroy();
      }
      // }
    });
  }, [persistance]);

  const value = { checkUser, signup, login, logout, reset, updateUserEmail, updateUserPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
