import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      console.log(storedUser);
    }

    setLoading(false);
  }, []);

  const login = (token, userObject) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userObject));
    setUser(userObject);
  };

  console.log(user)

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {loading ? (
        <div className="h-screen flex justify-center items-center text-xl">
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
