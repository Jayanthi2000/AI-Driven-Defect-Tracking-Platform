import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  loginUser, registerUser, logoutUser, validateToken,
  forgotPassword as forgotPasswordService,
  resetPassword  as resetPasswordService,
} from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true until rehydration completes

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const { valid, user: storedUser } = validateToken();
    if (valid && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = ({ email, password, rememberMe }) => {
    const result = loginUser({ email, password, rememberMe });
    if (result.success) {
      setUser(result.user);
    }
    return result; // { success, user, token } or { success: false, error }
  };

  const register = ({ name, email, password }) => {
    const result = registerUser({ name, email, password });
    return result; // { success, user } or { success: false, error }
  };

  const logout = () => {
    setUser(null);
    logoutUser();
  };

  const forgotPassword = (email) => {
    return forgotPasswordService(email);
  };

  const resetPassword = (token, newPassword) => {
    return resetPasswordService(token, newPassword);
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;