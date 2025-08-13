const express = require("express");
const router = express.Router();
const {
  createUserDetails,
  userLogin,
  verifyOtp,
  googleSignIn,
  googleSignUp,
  // getProjectsList,
  // getCoursesList,
  // createCourse,
} = require("../controllers/main");

router.route("/signup").post(createUserDetails);
router.route("/login").post(userLogin);
router.route("/verifyOtp").post(verifyOtp);
router.route("/auth/google-signin").post(googleSignIn);
router.route("/auth/google-signup").post(googleSignUp);
// router.route("/getProjects").get(getProjectsList);
// router.route("/getCourses").post(getCoursesList);
// router.route("/createCourse").post(createCourse);
module.exports = router;
