const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3060; 
// Middleware
app.use(express.json());
app.use(cors());

// Register Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  console.error(err.stack); // Log errors for debugging
  res.status(500).json({ message: 'An internal server error occurred' });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
