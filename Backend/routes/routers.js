const express = require("express");
const router = express.Router();

const {
  createUserDetails,
  userLogin,
  verifyOtp,
  googleSignIn,
  googleSignUp,
} = require("../controllers/main");

router.route("/signup").post(createUserDetails);

router.route("/login").post(userLogin);

router.route("/verifyOtp").post(verifyOtp);

router.route("/auth/google-signin").post(googleSignIn);

router.route("/auth/google-signup").post(googleSignUp);

module.exports = router;
