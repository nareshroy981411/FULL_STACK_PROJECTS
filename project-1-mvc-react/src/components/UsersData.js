import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "" });

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3040/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      alert("Failed to fetch users. Please try again later.");
    }
  };

  // Start editing a user
  const handleEdit = (user) => {
    setEditing(user.id);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  // Save the edited user
  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3040/admin/users/${id}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(null);
      fetchUsers();
      alert("User updated successfully.");
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      alert("Failed to update user. Please try again.");
    }
  };

  // Delete a user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3040/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Update users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Render an editable cell
  const renderEditableCell = (field, value) => (
    <TextField
      value={formData[field]}
      onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
    />
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      {users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {editing === user.id ? renderEditableCell("username", user.username) : user.username}
                </TableCell>
                <TableCell>
                  {editing === user.id ? renderEditableCell("email", user.email) : user.email}
                </TableCell>
                <TableCell>
                  {editing === user.id ? renderEditableCell("password", "******") : "******"}
                </TableCell>
                <TableCell>
                  {editing === user.id ? renderEditableCell("role", user.role) : user.role}
                </TableCell>
                <TableCell>
                  {editing === user.id ? (
                    <Button onClick={() => handleSave(user.id)} color="primary" variant="contained" size="small">
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => handleEdit(user)} color="primary" variant="outlined" size="small">
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(user.id)}
                    color="secondary"
                    variant="outlined"
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default Users;



// import React, { useEffect, useState } from 'react';
// import { Box, Typography, List, ListItem } from '@mui/material';
// import axios from 'axios';

// const AllUsers = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3040/admin/users');
//                 setUsers(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch users:', error);
//             }
//         };

//         fetchUsers();
//     }, []);

//     return (
//         <Box width="50%" mx="auto" mt={5}>
//             <Typography variant="h5" gutterBottom>All Users</Typography>
//             <List>
//                 {users.map((user, index) => (
//                     <ListItem key={index}>{user.username}</ListItem>
//                 ))}
//             </List>
//         </Box>
//     );
// };

// export default AllUsers;
