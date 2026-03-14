const { pool } = require("../db_connections/connections");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const generateCid = () => {
  return `cid:${Date.now()}@udemy.com`;
};

const getRoleId = async (role) => {
  const getRoleQuery = `
    SELECT role_id
    FROM user_roles
    WHERE role_name = $1
  `;

  try {
    const roleIDResult = await pool.query(getRoleQuery, [role]);

    if (roleIDResult.rowCount > 0) return roleIDResult.rows[0].role_id;

    throw new Error("user role ID not found");
  } catch (error) {
    console.error("Error while fetching user roleId:", error.message);
  }
};

const isUserExist = async (email) => {
  const query = await pool.query(
    `
     SELECT u.user_id, u.user_fullname, u.user_email, u.user_role_id, u.public_id, r.role_name AS user_role
     FROM user_details AS u
     JOIN user_roles AS r
     ON r.role_id = u.user_role_id
     WHERE u.user_email = $1;
    `,
    [email]
  );

  if (query.rowCount === 0) return { userFound: false };

  return { userFound: true, data: query.rows };
};

const createUser = async (fullname, email, role, password = email) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const roleID = await getRoleId(role);
  console.log("roleID", roleID);

  const insertData = `
    INSERT INTO user_details(user_fullname, user_email, password, user_role_id)
    VALUES($1, $2, $3, $4)`;

  try {
    return (result = await pool.query(insertData, [
      fullname,
      email,
      hashedPassword,
      roleID,
    ]));
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const getUserRole = async (roleID) => {
  const getRoleQuery = `
    SELECT role_name
    FROM user_roles
    WHERE role_id = $1
  `;

  try {
    const roleResult = await pool.query(getRoleQuery, [roleID]);

    if (roleResult.rowCount > 0) return roleResult.rows[0].role_name;

    throw new Error("User role name not found");
  } catch (error) {
    console.error("Error while fetching user role:", error.message);
  }
};

const getUserId = async (email) => {
  const userIdQuery = `SELECT user_id FROM user_details WHERE user_email=$1`;

  try {
    const userResult = await pool.query(userIdQuery, [email]);

    if (userResult.rowCount > 0) return userResult.rows[0].user_id;

    throw new Error("User not Found");
  } catch (error) {
    console.error("Error while fetching user id:", error.message);
  }
};

const verifyAndCheckUser = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { sub: userId, email, name } = payload;

  console.log(`UserID: ${userId}, Email: ${email}, Name: ${name}`);

  const { userFound, data } = await isUserExist(email);

  return { email, name, userFound, userData: data };
};

module.exports = {
  generateCid,
  getRoleId,
  isUserExist,
  createUser,
  getUserRole,
  getUserId,
  verifyAndCheckUser,
};
