const connectToDatabase = require('../config/database');

const getAdminById = async (id) => {
  const db = await connectToDatabase();
  const admin = await db.collection('admins').findOne({ _id: id });
  return admin;
};


const getAdminByEmail = async (email) => {
  const db = await connectToDatabase();
  const admin = await db.collection('admins').findOne({ email });
  return admin;
};

const createAdmin = async ({ username, email, password, role }) => {
  const db = await connectToDatabase();
  await db.collection('admins').insertOne({ username, email, password, role });
};

module.exports = { getAdminByEmail, createAdmin, getAdminById };
