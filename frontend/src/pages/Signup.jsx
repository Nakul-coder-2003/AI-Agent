import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    profileImg: null // File ke liye
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {setUser} = useContext(AuthContext);

  // Normal text inputs ke liye
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image file ke liye
  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImg: e.target.files[0] });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Kyunki hum image bhej rahe hain, FormData banana zaroori hai
      const data = new FormData();
      data.append('userName', formData.userName);
      data.append('email', formData.email);
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('password', formData.password);
      if (formData.profileImg) {
        data.append('profileImg', formData.profileImg);
      }

      // Direct Axios Call
      const response = await axios.post('http://localhost:8000/api/auth/signup', data, {
        withCredentials: true, // Cookies ke liye
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // console.log(response);
      setUser(response.data.user);

      alert('Signup successful! You can now log in.');
      // console.log('Success:', response.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Create Account</h2>
        
        {error && <p className="mb-4 text-sm font-medium text-red-500 text-center">{error}</p>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="userName" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <input type="file" name="profileImg" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-50" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;