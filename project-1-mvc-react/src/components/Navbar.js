import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine the current panel
    const isAdminPanel = location.pathname.startsWith('/admin');
    const isUserPanel = location.pathname.startsWith('/user');

    // Links for Admin Panel
    const adminLinks = [
        { label: 'Admin Signup', path: '/admin' },
        { label: 'Admin Login', path: '/admin/login' },
        { label: 'Profile Details', path: '/admin/profile' },
        { label: 'All Users', path: '/admin/users' },
        { label: 'All Admins', path: '/admin/admins' },
    ];

    // Links for User Panel
    const userLinks = [
        { label: 'User Signup', path: '/user' },
        { label: 'User Login', path: '/user/login' },
        { label: 'User Profile', path: '/user/profile' },
    ];

    // Select appropriate links
    const links = isAdminPanel ? adminLinks : isUserPanel ? userLinks : [];

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {isAdminPanel ? 'Admin Panel' : isUserPanel ? 'User Panel' : 'Portal'}
                </Typography>
                {links.map((link) => (
                    <Button
                        key={link.path}
                        color="inherit"
                        onClick={() => navigate(link.path)}
                        sx={{ marginLeft: 2 }}
                    >
                        {link.label}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
