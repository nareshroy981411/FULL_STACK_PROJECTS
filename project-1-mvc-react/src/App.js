import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminSignup from './components/SignupAdmin';
import Login from './components/Login';
import AdminProfile from './components/AdminProfile';
import AllUsers from './components/UsersData';
import AllAdmins from './components/AdminsData';
import UserSignup from './components/SignupUser';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar';

const AppRoutes = () => (
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminSignup />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/users" element={<AllUsers />} />
            <Route path="/admin/admins" element={<AllAdmins />} />
            <Route path="/user" element={<UserSignup />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/profile" element={<UserProfile />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
