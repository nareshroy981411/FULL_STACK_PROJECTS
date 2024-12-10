import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <Box textAlign="center" mt={5}>
            <Typography variant="h4" gutterBottom>Welcome to the Admin-User Portal</Typography>
            <Box mt={3}>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin')}>Admin Panel</Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/user')} sx={{ ml: 2 }}>User Panel</Button>
            </Box>
        </Box>
    );
};

export default HomePage;
