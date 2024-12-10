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

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "" });

  // Fetch admins from the server
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3040/admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Error fetching admins:", error.response?.data || error.message);
      alert("Failed to fetch admins. Please try again later.");
    }
  };

  // Start editing an admin
  const handleEdit = (admin) => {
    setEditing(admin.id);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: "",
      role: admin.role,
    });
  };

  // Save the edited admin
  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3040/admin/admins/${id}`,
        { ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(null);
      fetchAdmins();
      alert("Admin updated successfully.");
    } catch (error) {
      console.error("Error updating admin:", error.response?.data || error.message);
      alert("Failed to update admin. Please try again.");
    }
  };

  // Delete an admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3040/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdmins();
      alert("Admin deleted successfully.");
    } catch (error) {
      console.error("Error deleting admin:", error.response?.data || error.message);
      alert("Failed to delete admin. Please try again.");
    }
  };

  // Update admins when the component mounts
  useEffect(() => {
    fetchAdmins();
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
        Admins
      </Typography>
      {admins.length === 0 ? (
        <Typography>No admins found.</Typography>
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
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.id}</TableCell>
                <TableCell>
                  {editing === admin.id ? renderEditableCell("username", admin.username) : admin.username}
                </TableCell>
                <TableCell>
                  {editing === admin.id ? renderEditableCell("email", admin.email) : admin.email}
                </TableCell>
                <TableCell>
                  {editing === admin.id ? renderEditableCell("password", "******") : "******"}
                </TableCell>
                <TableCell>
                  {editing === admin.id ? renderEditableCell("role", admin.role) : admin.role}
                </TableCell>
                <TableCell>
                  {editing === admin.id ? (
                    <Button onClick={() => handleSave(admin.id)} color="primary" variant="contained" size="small">
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => handleEdit(admin)} color="primary" variant="outlined" size="small">
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(admin.id)}
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

export default Admins;

// import React, { useEffect, useState } from 'react';
// import { Box, Typography, List, ListItem } from '@mui/material';
// import axios from 'axios';

// const AllAdmins = () => {
//     const [admins, setAdmins] = useState([]);

//     useEffect(() => {
//         const fetchAdmins = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3040/admin/admins');
//                 setAdmins(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch admins:', error);
//             }
//         };

//         fetchAdmins();
//     }, []);

//     return (
//         <Box width="50%" mx="auto" mt={5}>
//             <Typography variant="h5" gutterBottom>All Admins</Typography>
//             <List>
//                 {admins.map((admin, index) => (
//                     <ListItem key={index}>{admin.username}</ListItem>
//                 ))}
//             </List>
//         </Box>
//     );
// };

// export default AllAdmins;
