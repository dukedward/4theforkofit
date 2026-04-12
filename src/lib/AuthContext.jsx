import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { syncUser } from "@/api/user";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoadingAuth(true);
      setAuthError(null);

      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setIsLoadingAuth(false);
          return;
        }

        setUser(firebaseUser);

        const syncedProfile = await syncUser(firebaseUser);
        setProfile(syncedProfile);
      } catch (error) {
        console.error("Auth/profile sync error:", error);
        setAuthError(error);
        setUser(firebaseUser || null);
        setProfile(null);
      } finally {
        setIsLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    const result = await signInWithPopup(auth, googleProvider);
    const syncedProfile = await syncUser(result.user);
    setUser(result.user);
    setProfile(syncedProfile);
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!auth.currentUser) return null;
    const syncedProfile = await syncUser(auth.currentUser);
    setProfile(syncedProfile);
    return syncedProfile;
  };

  const loginWithEmail = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email, password, username) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { username });
    await syncUser(result.user);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      isAdmin: profile?.role === "admin",
      isLoadingAuth,
      authError,
      loginWithGoogle,
      loginWithEmail,
      logout,
      refreshProfile,
      registerWithEmail,
    }),
    [user, profile, isLoadingAuth, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
