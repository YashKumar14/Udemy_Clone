const { pool } = require("../db_connections/connections");
const jwt = require("jsonwebtoken");
const { badRequestError } = require("../errors");
const nodemailer = require("nodemailer");
const { mailTemplate } = require("../emailTemplate/mailTemplate");
const {
  generateCid,
  isUserExist,
  createUser,
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

  const insertData = `INSERT INTO user_details(user_fullname, user_email, password,user_role)
   VALUES($1,$2,$3,$4)`;

  const insertQuery = await pool.query(insertData, [
    fullname,
    email,
    password,
    role,
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

  const userExist = await isUserExist(email);

  if (userExist.rows.length === 0) {
    return res.status(404).json({ userFound: false });
  } else {
    sendOtp(req, res, email, userExist);
  }
};

const sendOtp = async (req, res, email, userExist) => {
  const name = userExist.rows[0].user_fullname;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const { EXPIRE_TIME, JWT_SECRET, JWT_EXPIRE } = process.env;

  const cid = generateCid();

  const emailHtml = mailTemplate(name, otp, EXPIRE_TIME, cid);

  // console.log(userExist);
  const payload = {
    userId: userExist.rows[0].user_id,
    email: userExist.rows[0].user_email,
    name: name,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });

  // console.log(token);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.status(500).json({ msg: "Error sending OTP" });
    }

    const storeOtpQuery = `
    INSERT INTO otp_codes(email,otp,expires_at,is_Expired)
    VALUES($1,$2,NOW()+INTERVAL '${EXPIRE_TIME}',$3);
    `;

    await pool.query(storeOtpQuery, [email, otp, false]);
    res.status(200).json({
      msg: `OTP sent to Email successfully: ${info.response}`,
      success: true,
      email,
      name,
      token,
    });
  });
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log(req.headers["authorization"]);
  console.log(token);

  if (!token) {
    return res.status(401).json({ msg: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }

  const otpQuery = `
  SELECT * FROM otp_codes
  WHERE email=$1 AND otp=$2 AND is_expired=false`;

  const result = await pool.query(otpQuery, [email, otp]);

  if (result.rows.length === 0) {
    return res.status(400).json({ success: false, msg: "Invalid OTP" });
  }

  if (new Date() > new Date(result.rows[0].expires_at)) {
    return res.status(400).json({ success: false, msg: "OTP has expired" });
  }
  return res
    .status(200)
    .json({ success: true, msg: "OTP verified successfully" });
};

const googleSignIn = async (req, res) => {
  // const { token } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  try {
    const { email, name, userExist } = await verifyAndCheckUser(token);

    if (userExist.rows.length === 0) {
      return res.status(404).json({ userFound: false });
    } else {
      const userName = userExist.rows[0].user_fullname;

      return res.status(200).json({ success: true, email, userName });
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

// const getProjectsList = async (req, res) => {
//   try {
//     const getProjectsQuery = `SELECT * FROM projects_data`;

//     const result = await pool.query(getProjectsQuery);

//     if (result.rowCount > 0) {
//       console.log("data", result.rows);
//       return res.status(200).json({ projects: result.rows });
//     } else {
//       return res.status(200).json({ projects: [] });
//     }
//   } catch (error) {
//     console.error("Error while fetching projects data ", error.message);
//     return res.status(500).json({
//       success: false,
//       msg: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// const getCoursesList = async (req, res) => {
//   const { projectName } = req.body;

//   try {
//     let projectId;

//     const checkProjectName = `
//       SELECT project_id  FROM projects_data
//       WHERE project_name=$1
//     `;

//     const selectResult = await pool.query(checkProjectName, [projectName]);

//     if (selectResult.rowCount > 0) {
//       projectId = selectResult.rows[0].project_id;
//       const getCoursesQuery = `
//         SELECT course_title FROM courses_data
//         WHERE project_id=$1
//       `;

//       const courseResult = await pool.query(getCoursesQuery, [projectId]);

//       if (courseResult.rowCount > 0) {
//         return res.status(200).json({ courses: courseResult.rows });
//       } else {
//         return res.status(200).json({ courses: [] });
//       }
//     } else {
//       return res.status(200).json({ courses: [] });
//     }
//   } catch (error) {
//     console.error("Error while fetching courses data ", error.message);
//     return res.status(500).json({
//       success: false,
//       msg: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// const createCourse = async (req, res) => {
//   const {
//     projectName,
//     courseTitle,
//     courseDescription,
//     imageUrl,
//     videoUrl,
//     videoDescription,
//   } = req.body;

//   try {
//     await pool.query("BEGIN");

//     const selectProjectQuery = `
//       SELECT project_id FROM projects_data
//       WHERE project_name=$1
//     `;

//     const selectResult = await pool.query(selectProjectQuery, [projectName]);

//     let projectId;

//     if (selectResult.rowCount > 0) {
//       projectId = selectResult.rows[0].project_id;
//     } else {
//       const insertProjectQuery = `
//         INSERT INTO projects_data(project_name)
//         VALUES($1) RETURNING project_id
//       `;

//       const insertProjectResult = await pool.query(insertProjectQuery, [
//         projectName,
//       ]);

//       projectId = insertProjectResult.rows[0].project_id;
//     }

//     const courseResult = await pool.query(
//       `SELECT course_id FROM courses_data WHERE project_id = $1 AND course_title = $2`,
//       [projectId, courseTitle]
//     );

//     let courseId;

//     if (courseResult.rowCount > 0) {
//       courseId = courseResult.rows[0].course_id;
//     } else {
//       const insertCourseQuery = `
//       INSERT INTO courses_data(project_id,course_title,course_description,course_image,created_by)
//       VALUES($1, $2, $3, $4, $5) RETURNING course_id
//     `;

//       const insertCourseResult = await pool.query(insertCourseQuery, [
//         projectId,
//         courseTitle,
//         courseDescription,
//         imageUrl,
//         "Admin",
//       ]);

//       courseId = insertCourseResult.rows[0].course_id;
//     }

//     const insertVideoQuery = `
//       INSERT INTO courses_url(course_id,video_description,video_url)
//       VALUES($1,$2,$3)
//     `;

//     await pool.query(insertVideoQuery, [courseId, videoDescription, videoUrl]);

//     await pool.query("COMMIT");

//     return res.status(200).json({
//       success: true,
//       msg: "Course created successfully",
//       data: {
//         projectId,
//         courseId,
//         projectName,
//         courseTitle,
//       },
//     });
//   } catch (error) {
//     await pool.query("ROLLBACK");
//     console.error("Error while creating course:", error.message);
//     return res.status(400).json({
//       success: false,
//       msg: "Failed to create course",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  createUserDetails,
  userLogin,
  verifyOtp,
  googleSignIn,
  googleSignUp,
  // getProjectsList,
  // getCoursesList,
  // createCourse,
};
