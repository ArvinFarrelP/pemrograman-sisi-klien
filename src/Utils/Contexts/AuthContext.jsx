import { createContext, useContext, useState } from "react";

const AuthStateContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userState, setUserState] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (user) => {
    setUserState(user);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthStateContext.Provider value={{ user: userState, setUser }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => useContext(AuthStateContext);