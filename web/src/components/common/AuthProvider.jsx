import { useState, useEffect } from "react";
import { AuthContext } from "../../hooks/useAuth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());

  function getUser() {
    let token = localStorage.getItem("access_token");
    if (token) {
      const { id, exp } = JSON.parse(window.atob(token.split(".")[1]));
      if (exp * 1000 > Date.now()) {
        return { id, token };
      } else {
        localStorage.removeItem("access_token");
      }
    }
    return null;
  }

  function saveUser(token) {
    localStorage.setItem("access_token", token);
    const { id } = JSON.parse(window.atob(token.split(".")[1]));
    setUser({ id, token });
  }

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, saveUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
