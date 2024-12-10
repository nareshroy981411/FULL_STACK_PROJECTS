import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Retrieve token from localStorage
                const token = localStorage.getItem('token'); 

                if (!token) {
                    throw new Error('No token found. Please log in.');
                }

                const response = await axios.get('http://localhost:3040/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });

                // Set the user object from the response data
                setProfile(response.data.user);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box width="50%" mx="auto" mt={5}>
                <Typography variant="h5" gutterBottom color="error">
                    Error
                </Typography>
                <Typography>{error}</Typography>
            </Box>
        );
    }

    return (
        <Box width="50%" mx="auto" mt={5}>
            <Typography variant="h4" gutterBottom>
                User Profile
            </Typography>
            {profile && (
                <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="body1">
                        <strong>Username:</strong> {profile.username}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Email:</strong> {profile.email}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Role:</strong> {profile.role}
                    </Typography>
                    <Typography variant="body1">
                        <strong>User ID:</strong> {profile.id}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default UserProfile;
