import React, { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs'; // or any other encryption library
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from 'react-router-dom';
import loginimg from "../assets/undraw_login_re_4vu2.svg"
function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const getAuth = async () => {
      const encryptedPassword = localStorage.getItem('adminPassword');
      const decryptedPassword = process.env.REACT_APP_ADMIN_PASSWORD;
      const isValidPassword = await bcrypt.compare(decryptedPassword, encryptedPassword);
      localStorage.setItem("adminAuth",isValidPassword)
    }
    getAuth()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (process.env.REACT_APP_ADMIN_PASSWORD === password) {
        const encryptedPassword = await bcrypt.hash(password, 10);
        localStorage.setItem('adminPassword', encryptedPassword);
        localStorage.setItem("adminAuth",true)
        toast.success('Login Successful');
        navigate("/owner")
      } else {
        toast.error('Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login. Please try again.');
    }
  };

  if (localStorage.getItem("adminAuth") === true || localStorage.getItem("adminAuth") === "true") {
    return (<Navigate to="/owner" replace={true}/>)
  }
  return (
    <div className="admin-login">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className='innerLoginAdmin'>
        <img src={loginimg}></img>
        <div>
          <h2>Welcome Admin</h2>
          <form onSubmit={handleLogin}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder='Type Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
          
        </div>
        
      </div>
    </div>
  );
}

export default AdminLogin;
