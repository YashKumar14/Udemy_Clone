const { pool } = require("../db_connections/connections");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const isUserExist = async (email) => {
  return await pool.query(
    `SELECT * FROM user_details
    WHERE user_email = $1;
    `,
    [email]
  );
};

const generateCid = () => {
  return `cid:${Date.now()}@udemy.com`;
};

const createUser = async (fullname, email, role, password = email) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const insertData = `
    INSERT INTO user_details(user_fullname, user_email, password, user_role)
    VALUES($1, $2, $3,$4)`;

  try {
    return (result = await pool.query(insertData, [
      fullname,
      email,
      hashedPassword,
      role,
    ]));
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

const verifyAndCheckUser = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const userId = payload.sub;
  const email = payload.email;
  const name = payload.name;

  console.log(`UserID: ${userId},Email: ${email}, Name: ${name}`);

  const userExist = await isUserExist(email);

  return { email, name, userExist };
};

module.exports = { isUserExist, generateCid, createUser, verifyAndCheckUser };
