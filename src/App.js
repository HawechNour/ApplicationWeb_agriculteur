import Login from "./components/auth/login";
import Register from "./components/auth/register";

import SideBar from "./components/SideBar";
import Home from "./components/Home";

import AdminLogin from "./Admin/AdminLogin"
import bcrypt from 'bcryptjs';
import { AuthProvider } from "./contexts/authContext";
import { BrowserRouter as Router, Routes, Route, Outlet , Navigate } from 'react-router-dom';
import { useAuth } from './contexts/authContext'
import Profile from "./components/Profile";
import ChangeProfile from "./components/ChangeProfile";
import ChnagePassword from "./components/ChnagePassword";
import Stock from "./components/Stock";
import Fournisseur from "./components/Fournisseur";
import Client from "./components/Client"
import Product from "./components/Product";
import AddToStock from "./components/AddToStock";
import AddToFournisseur from "./components/AddToFournisseur";
import AddToClient from "./components/AddToClient";
import AddToProduct from "./components/AddToProduct";
import ForgotPassword from "./components/ForgotPassword";
import Help from "./components/Help";
import Transactions from "./components/Transactions";
import Buy from "./components/Buy";
import Sell from "./components/Sell";
import TransHistory from "./components/TransHistory"
import MyCalendar from "./components/Calendar";
import Statistics from "./components/Statistics";
import { useEffect, useState } from "react";
import AdminSideBar from "./Admin/AdminSideBar";
import Users from "./Admin/Users";
import Requests from "./Admin/Requests";
import StatsAdmin from "./Admin/AdminStats";
function UserPrivateRoutes() {
  const { userLoggedIn } = useAuth();
  return userLoggedIn ? (
    <div className="userDash">
      <SideBar />
      <Outlet/>
    </div>
  ) : (<Navigate to="/login" replace={true}/>)
}

function AdminPrivateRoutes() {
  
  useEffect(() => {
    const getAuth = async () => {
      const encryptedPassword = localStorage.getItem('adminPassword');
      const decryptedPassword = process.env.REACT_APP_ADMIN_PASSWORD;
      const isValidPassword = await bcrypt.compare(decryptedPassword, encryptedPassword);
      localStorage.setItem("adminAuth",isValidPassword)
    }
    getAuth()
  }, [])
  
  return localStorage.getItem("adminAuth") === true ||localStorage.getItem("adminAuth") === "true"   ? (
    <div className="adminDash">
      <AdminSideBar/>
      <Outlet></Outlet>
    </div>
  ) : (<Navigate to="/admin/login" replace={true}/>)
}
function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Private Routes */}
          <Route path="/owner" element={<AdminPrivateRoutes/>}>
            <Route path="users" element={<Users/>}/>
            <Route path="stats" element={<StatsAdmin/>}/>
            <Route path="requests" element={<Requests/>}/>
          </Route>  
          {/* Admin Public Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User Private Routes */}
          <Route path="/dashboard" element={<UserPrivateRoutes />} >
            
            <Route path="profile"  element={<Profile/>}/>
            <Route path="chnage-password"  element={<ChnagePassword/>}/>
            <Route path="chnage-profile"  element={<ChangeProfile/>}/>
            
            <Route path="stock"  element={<Stock/>}/>
            <Route path="add-to-stock"  element={<AddToStock/>}/>

            <Route path="fournisseur"  element={<Fournisseur/>}/>
            <Route path="add-to-fournisseur"  element={<AddToFournisseur/>}/>

            <Route path="client"  element={<Client/>}/>
            <Route path="add-to-client"  element={<AddToClient/>}/>

            <Route path="product"  element={<Product/>}/>
            <Route path="add-to-product"  element={<AddToProduct/>}/>

            <Route path="transactions" element={<Transactions/>}>
              <Route  path="buy" element={<Buy/>}/>
              <Route path="sell"  element={<Sell/>}/>
              <Route index path="*"  element={<TransHistory/>}/>
            </Route>

            <Route path="calendar" element={<MyCalendar/>}/>
            <Route path="help" element={<Help/>} />

            <Route path="*" index element={<Statistics/>}/>
          </Route>

          {/* User Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Define a default route */}
          <Route path="*" element={<Home />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;