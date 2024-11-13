import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  registerSSO: () => void;
  register: (username: string,email: string, password: string) => void;
  login: (email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const registerSSO = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        // O redirecionamento será tratado pelo onAuthStateChanged
      })
      .catch((error) => {
        console.error("Erro no login com Google:", error.message);
      });
  };

  const register = (username: string, email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
       
      })
      .catch((error) => {
        console.error("Erro no login com e-mail:", error.message);
      });
  };

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
       
      })
      .catch((error) => {
        console.error("Erro no registro com e-mail:", error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, registerSSO, login, register }}>
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
