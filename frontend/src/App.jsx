// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <nav>
          <Link to="/login" style={{ marginRight: '20px' }}>Login</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
        
        {/* Yaha par humare routes render honge */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;