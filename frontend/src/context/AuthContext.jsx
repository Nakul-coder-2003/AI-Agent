import { createContext, useEffect, useState } from "react";
import axios from "axios"
// Step 1: Context Create kiya
export const AuthContext = createContext()

// Step 2: Provider Component banaya
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
   try {
      const savedUser = localStorage.getItem('user');
      // NAYA: Check karo ki data hai aur wo literal string "undefined" nahi hai
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null; // Agar parse fail ho jaye, toh crash hone ki jagah null return karo
    }
  }); 
  const [loading, setLoading] = useState(true); 
  
  // App load hote hi sabse pehle backend se check karenge ki user kaun hai
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/curr-user', {
          withCredentials: true // Cookies (token) bhejne ke liye zaroori hai
        });
        
        setUser(response.data.user);
        localStorage.setItem('user',JSON.stringify(response.data.user));
      } catch (error) {
        console.log(error)
        console.error("🚨 Session Check Failed:", error.response ? error.response.data : error.message);
        console.error("🚨 Status Code:", error.response?.status);
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