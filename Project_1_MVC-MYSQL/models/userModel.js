const connectToDatabase = require('../config/database');

const getUserById = async (id) => {
  const connection = await connectToDatabase();
  const [users] = await connection.execute(
    'SELECT id, username, email, role FROM users WHERE id = ?',
    [id]
  );
  return users[0];
};

const getUserByEmail = async (email) => {
  const connection = await connectToDatabase();
  const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  return users[0];
};

const createUser = async ({ username, email, password, role }) => {
  const connection = await connectToDatabase();
  await connection.execute(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, password, role]
  );
};


module.exports = { getUserByEmail, createUser, getUserById };
