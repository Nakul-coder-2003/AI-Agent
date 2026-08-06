import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  // Text fields ke liye state
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    userName: '', 
    email: '', 
    password: '' 
  });
  
  // File (Image) ke liye alag state
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  // Text inputs handle karne ka function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // File input handle karne ka function
  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]); // Sirf pehli file select karni hai
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // File upload ke liye FormData banana zaroori hai
    const submitData = new FormData();
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('userName', formData.userName);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    
    // Agar user ne image select ki hai, tabhi usko append karo
    if (profileImage) {
      // NOTE: 'profileImg' naam wahi hona chahiye jo backend mein Multer expect kar raha hai
      // jaise: upload.single('profileImg')
      submitData.append('profileImg', profileImage); 
    }

    try {
      const response = await axios.post('http://localhost:8000/auth/signup', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Ye header files bhejne ke liye zaroori hai
        }
      });
      alert('Signup Successful! Please Login.');
      navigate('/login'); 
    } catch (error) {
      alert('Error in signup: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        
        <input 
          type="text" name="firstName" placeholder="First Name" 
          onChange={handleChange} required style={inputStyle} 
        />
        
        <input 
          type="text" name="lastName" placeholder="Last Name" 
          onChange={handleChange} required style={inputStyle} 
        />
        
        <input 
          type="text" name="userName" placeholder="Username" 
          onChange={handleChange} required style={inputStyle} 
        />
        
        <input 
          type="email" name="email" placeholder="Email" 
          onChange={handleChange} required style={inputStyle} 
        />
        
        <input 
          type="password" name="password" placeholder="Password" 
          onChange={handleChange} required style={inputStyle} 
        />
        
        <div style={fileInputContainerStyle}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Profile Picture:</label>
          <input 
            type="file" name="profileImg" accept="image/*" 
            onChange={handleFileChange} style={inputStyle} 
          />
        </div>

        <button type="submit" style={btnStyle}>Sign Up</button>
      </form>
    </div>
  );
}

// Basic CSS Styling objects
const inputStyle = { display: 'block', width: '100%', padding: '10px', margin: '10px 0' };
const btnStyle = { padding: '10px 20px', backgroundColor: 'blue', color: 'white', cursor: 'pointer', width: '100%', border: 'none', borderRadius: '5px' };
const fileInputContainerStyle = { textAlign: 'left', margin: '10px 0' };

export default Signup;