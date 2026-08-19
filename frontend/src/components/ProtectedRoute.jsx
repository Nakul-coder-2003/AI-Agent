import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Step 3 (Consume): Context se user aur loading state nikal li
  const { user, loading } = useContext(AuthContext);

  // Jab tak backend se data aa raha hai, tab tak Loading screen dikhao
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if(!user){
    return <Navigate to='/login' replace/>
  }
  
  return children;
};

export default ProtectedRoute;
