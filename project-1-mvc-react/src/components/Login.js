import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3040/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" onChange={handleChange} required />
          <Button type="submit" variant="contained" color="primary">Login</Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;


// import React, { useState } from 'react';
// import { Box, Button, TextField, Typography } from '@mui/material';
// import axios from 'axios';

// const Login = () => {
//     const [form, setForm] = useState({ email: '', password: '' });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post('http://localhost:3040/auth/login', form);
//             alert('Admin logged in successfully!');
//         } catch (error) {
//             alert('Login failed');
//         }
//     };

//     return (
//         <Box width="50%" mx="auto" mt={5}>
//             <Typography variant="h5" gutterBottom>Admin Login</Typography>
//             <form onSubmit={handleSubmit}>
//                 <TextField
//                     label="Email"
//                     fullWidth
//                     margin="normal"
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 />
//                 <TextField
//                     label="Password"
//                     type="password"
//                     fullWidth
//                     margin="normal"
//                     onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 />
//                 <Button variant="contained" type="submit" color="primary">Login</Button>
//             </form>
//         </Box>
//     );
// };

// export default Login;
