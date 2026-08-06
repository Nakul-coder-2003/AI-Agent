// src/components/Login.jsx
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData);
      alert('Login Successful!');
      
      // Backend se aane wale token ko browser ki localStorage mein save karna
      localStorage.setItem('token', response.data.token); 
      
      // Yaha se aap user ko dashboard ya home page par redirect kar sakte ho
    } catch (error) {
      alert('Error in login: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={btnStyle}>Login</button>
      </form>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '10px', margin: '10px 0' };
const btnStyle = { padding: '10px 20px', backgroundColor: 'green', color: 'white', cursor: 'pointer' };

export default Login;