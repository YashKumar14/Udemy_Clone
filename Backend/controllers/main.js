const { pool } = require("../db_connections/connections");
const jwt = require("jsonwebtoken");
const { badRequestError } = require("../errors");
const nodemailer = require("nodemailer");
const { mailTemplate } = require("../emailTemplate/mailTemplate");
const {
  generateCid,
  getRoleId,
  isUserExist,
  createUser,
  getUserRole,
  getUserId,
  verifyAndCheckUser,
} = require("../utils/util");

const createUserDetails = async (req, res) => {
  const { fullname, email, password, role } = req.body;

  if (!fullname || !email || !password || !role) {
    throw new badRequestError("Please provided fullname, email and password");
  }

  const userExist = await isUserExist(email);

  if (userExist.rows.length > 0) {
    return res.status(400).json({ isEmailExist: true, data: userExist.rows });
  }

  const roleID = await getRoleId(role);

  console.log("roleId:::", roleID);

  const insertData = `INSERT INTO user_details(user_fullname, user_email, password, user_role_id)
   VALUES($1,$2,$3,$4)`;

  const insertQuery = await pool.query(insertData, [
    fullname,
    email,
    password,
    roleID,
  ]);

  if (insertQuery.rowCount > 0) {
    return res.status(201).json({
      success: true,
      msg: "user created successfully",
      no_of_rows_inserted: insertQuery.rowCount,
    });
  } else {
    return res
      .status(500)
      .json({ success: false, msg: "Failed to create user" });
  }
};

const userLogin = async (req, res) => {
  const { email } = req.body;

  console.log("email", email);

  const userExist = await isUserExist(email);

  console.log("userExist", userExist.rows[0]);

  if (userExist.rows.length === 0)
    return res.status(404).json({ userFound: false });

  sendOtp(req, res, email, userExist);
};

const sendOtp = async (req, res, email, userExist) => {
  const {
    user_fullname: userName,
    user_role_id,
    user_id: userId,
    user_email: userEmail,
  } = userExist.rows[0];

  // check whether user is blocked or not
  const isUserBlockQuery = await pool.query(
    `
    SELECT block_until
    FROM otp_codes
    WHERE user_id = $1;
  `,
    [userId]
  );

  const isUserBlockedToLogin = isUserBlockQuery?.rows[0]?.block_until || null;

  console.log("isUserBlockedToLogin", isUserBlockedToLogin);

  const blockedInMinutes =
    Math.ceil(isUserBlockedToLogin - new Date()) / (1000 * 60);

  console.log("blockedInMinutes", blockedInMinutes);

  if (blockedInMinutes > 0) {
    return res.status(429).json({
      msg: `You have Reached Maximum number of attempts. Please try again after ${blockedInMinutes} minutes.`,
      block_until: isUserBlockedToLogin,
    });
  }

  const userRole = await getUserRole(user_role_id);
  console.log("userRole", userRole);

  const OtpDataQuery = await pool.query(
    `
      SELECT otp_attempts, expires_at,created_at
      FROM otp_codes
      WHERE user_id = $1;
    `,
    [userId]
  );

  const userOtpData = OtpDataQuery.rows[0];
  console.log("userOtpData", userOtpData);

  let otpAttempts = 0;
  let lastAttemptAt = null;
  let createdAt = null;
  let difference = 0;

  if (userOtpData) {
    otpAttempts = userOtpData.otp_attempts || 0;
    lastAttemptAt = userOtpData.expires_at;
    createdAt = userOtpData.created_at;
    difference = Math.floor((lastAttemptAt - createdAt) / (1000 * 60));
  }

  console.log({ otpAttempts, difference });

  // Block user to login, if tried to attempt login more than 3 times within 10 minutes time span
  if (otpAttempts > 2 && difference < 10) {
    console.log("IF CONDITION");
    const blockUntil = new Date(Date.now() + 15 * 60 * 1000);
    const blockQuery = `
        UPDATE otp_codes
        SET block_until = $1
        WHERE user_id = $2;
      `;
    await pool.query(blockQuery, [blockUntil, userId]);
    return res.status(429).json({
      msg: "You have Reached Maximum number of attempts. Please try again after 15 minutes.",
      block_until: blockUntil,
    });
  }

  // Generate random 6 digits OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("otp generated", otp);

  const { EXPIRE_TIME, JWT_SECRET, JWT_EXPIRE } = process.env;
  const expireSeconds = parseInt(EXPIRE_TIME || "300");

  const formatExpiry = (seconds) => {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    return `${Math.floor(seconds / 3600)} hours`;
  };

  const expiryReadable = formatExpiry(expireSeconds);

  const cid = generateCid();

  console.log({ cid });

  const emailHtml = mailTemplate(userName, otp, expiryReadable, cid);

  // console.log(userExist);
  const payload = {
    userId: userId,
    email: userEmail,
    name: userName,
    userRole,
  };

  // Generate JWT token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });

  console.log({ token });

  // If user not blocked sent OTP to mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // prevent self-signed cert errors in Render
    },
  });

  const mailOptions = {
    from: `"Udemy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Udemy Login: Here's the 6-digit verification code you requested",
    html: emailHtml,
    attachments: [
      {
        filename: "logo-udemy.png",
        path: "./public/logo-udemy.png",
        cid: cid,
      },
    ],
  };

  console.log({ transporter, mailOptions });

  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection failed:", error);
    } else {
      console.log("SMTP server is ready to send messages", success);
    }
  });

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) return res.status(500).json({ msg: "Error sending OTP" });
    console.log({ info });

    const upsertQuery = `
      INSERT INTO otp_codes(user_id, otp, expires_at, otp_attempts)
      VALUES($1, $2, NOW() + ($3 || ' seconds')::interval, 1)
      ON CONFLICT (user_id) 
      DO UPDATE SET otp = $2,
                    expires_at = NOW() + ($3 || ' seconds')::interval,
                    otp_attempts = otp_codes.otp_attempts + 1;
    `;

    await pool.query(upsertQuery, [userId, otp, expireSeconds]);

    console.log("otp data inserted in db");

    res.status(200).json({
      msg: `OTP sent to Email successfully: ${info.response}`,
      success: true,
      email,
      userName,
      token,
      userRole,
    });

    console.log(`OTP sent to Email successfully: ${info.response}`);
  });
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log(req.headers["authorization"]);
  console.log("token", token);

  if (!token) {
    return res.status(401).json({ msg: "Token is missing" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded Token", decodedToken);
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }

  const userId = await getUserId(email);

  const otpQuery = `
  SELECT * FROM otp_codes
  WHERE user_id=$1 AND is_expired=false
  ORDER BY expires_at DESC
  LIMIT 1`;

  const result = await pool.query(otpQuery, [userId]);
  console.log("otp results", result.rows);

  if (result.rows.length === 0) {
    return res.status(400).json({ success: false, msg: "No valid OTP found" });
  }

  const latestOtp = result.rows[0];
  if (latestOtp.otp !== otp) {
    return res.status(400).json({ success: false, msg: "Invalid OTP" });
  }

  if (new Date() > new Date(latestOtp.expires_at)) {
    return res.status(400).json({ success: false, msg: "OTP has expired" });
  }

  const updateOtpAttemptsQuery = `
    UPDATE otp_codes
    SET otp_attempts = 0
    WHERE user_id = $1
  `;

  try {
    await pool.query(updateOtpAttemptsQuery, [latestOtp.user_id]);
    console.log(`OTP attempts reset to 0 for User ID: ${latestOtp.user_id}`);
  } catch (error) {
    console.error("Error resetting OTP attempts:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Failed to reset OTP attempts" });
  }

  return res.status(200).json({
    success: true,
    msg: "OTP verified successfully",
    userRole: decodedToken.userRole,
  });
};

const googleSignIn = async (req, res) => {
  // const { token } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    const { email, name, userExist } = await verifyAndCheckUser(token);

    if (userExist.rows.length === 0) {
      return res.status(404).json({ userFound: false });
    } else {
      const { user_fullname: userName, user_role_id } = userExist.rows[0];
      const userRole = await getUserRole(user_role_id);
      console.log("userRole", userRole);
      return res.status(200).json({ success: true, email, userName, userRole });
    }
  } catch (error) {
    console.error("Error while verifying ID token: ", error);
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorised", error: error.message });
  }
};

const googleSignUp = async (req, res) => {
  // const { token } = req.body;
  const { role } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    const { email, name, userExist } = await verifyAndCheckUser(token);

    if (userExist.rows.length > 0) {
      return res.status(404).json({ userFound: true });
    } else {
      const createUserResponse = await createUser(name, email, role);

      return res.status(201).json({
        success: true,
        msg: "User created successfully",
        no_of_rows_inserted: createUserResponse.rowCount,
      });
    }
  } catch (error) {
    console.error("Error while verifying ID token: ", error);
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorised", error: error.message });
  }
};

module.exports = {
  createUserDetails,
  userLogin,
  verifyOtp,
  googleSignIn,
  googleSignUp,
};
