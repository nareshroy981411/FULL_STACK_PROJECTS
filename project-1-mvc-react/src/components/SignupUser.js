import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const UserSignup = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3040/auth/signup/user', form);
            alert('User signed up successfully!');
        } catch (error) {
            alert('Signup failed');
        }
    };

    return (
        <Box width="50%" mx="auto" mt={5}>
            <Typography variant="h5" gutterBottom>User Signup</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <Button variant="contained" type="submit" color="primary">Signup</Button>
            </form>
        </Box>
    );
};

export default UserSignup;
