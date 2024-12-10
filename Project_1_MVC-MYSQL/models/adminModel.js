const connectToDatabase = require('../config/database');

const getAdminById = async (id) => {
  const connection = await connectToDatabase();
  const [admins] = await connection.execute(
    'SELECT id, username, email, role FROM admins WHERE id = ?',
    [id]
  );
  return admins[0];
};

const getAdminByEmail = async (email) => {
  const connection = await connectToDatabase();
  const [admins] = await connection.execute('SELECT * FROM admins WHERE email = ?', [email]);
  return admins[0];
};

const createAdmin = async ({ username, email, password, role }) => {
  const connection = await connectToDatabase();
  await connection.execute(
    'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, password, role]
  );
};


module.exports = { getAdminByEmail, createAdmin, getAdminById };
