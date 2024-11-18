import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  registerSSO: () => void;
  register: (username: string, email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const saveUserToSessionStorage = (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('uid', user.uid);
  };

  const registerSSO = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid); // Correção: Referência de documento correta com dois segmentos
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        const userData = {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL,
        };
        await setDoc(userRef, userData);
      }

      saveUserToSessionStorage(user);
      setUser(user);
      navigate('/');
    } catch (error) {
      console.error("Erro no login com Google:", error);
    }
  };

  const register = (username: string, email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        const user = result.user;

        const userRef = doc(db, 'users', user.uid); // Correção: Referência de documento correta com dois segmentos
        const userSnapshot = await getDoc(userRef);
        if (!userSnapshot.exists()) {
          const userData = {
            id: user.uid,
            email: user.email,
            name: username,
            avatar: user.photoURL,
          };
          await setDoc(userRef, userData);
        }

        saveUserToSessionStorage(user);
        setUser(user);
        navigate('/');
      })
      .catch((error) => {
        console.error("Erro no registro com e-mail:", error.message);
      });
  };

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;

        saveUserToSessionStorage(user);
        setUser(user);
        navigate('/');
      })
      .catch((error) => {
        console.error("Erro no login com e-mail:", error.message);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('uid');
        navigate('/login');
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        saveUserToSessionStorage(currentUser);
      } else {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('uid');
      }
      setUser(currentUser);
    });

    return unsubscribe;
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, registerSSO, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
