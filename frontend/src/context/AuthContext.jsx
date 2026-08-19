import { createContext, useEffect, useState } from "react";

// Step 1: Context Create kiya
export const AuthContext = createContext()

// Step 2: Provider Component banaya
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const savedUser = localStorage.getItem('user');
    return savedUser? JSON.parse(savedUser) : null;
  }); 
  const [loading, setLoading] = useState(true); 
  

  // App load hote hi sabse pehle backend se check karenge ki user kaun hai
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/me', {
          withCredentials: true // Cookies (token) bhejne ke liye zaroori hai
        });
        
        setUser(response.data.user);
        localStorage.setItem('user',JSON.stringify(response.data.user));
      } catch (error) {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false); // Check complete ho gaya
      }
    };

    checkUserLoggedIn();
  }, []); // Khali array [] ka matlab hai ki yeh sirf ek baar run hoga jab app khulegi

  const logout = () => {
    // 1. LocalStorage se user hata do
    localStorage.removeItem('user');
    // 2. Context state ko null kar do
    setUser(null);
    // (Optional) Agar backend mein logout route hai toh yahan axios.post call kar sakte hain
  };
  // Jo bhi data hum value mein pass karenge, wo puri app mein available hoga
  return (
    <AuthContext.Provider value={{ user, setUser, loading,logout }}>
      {children}
    </AuthContext.Provider>
  );
};