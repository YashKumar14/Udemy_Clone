import axios from "axios";
import { setAuthCookie } from "@/utils/cookie.js";
import { useToken } from "./useToken";

const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
const { setToken } = useToken();

export const signInWithGoogle = (router, handleError) => {
  console.log("calling function....");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      console.log("Google Sign-In response received...");
      handleCredentialResponse(response, router, handleError);
    },
    auto_select: false,
  });

  const googleSignIn = localStorage.getItem("is_sign_in_with_google");

  const container = document.querySelector(".google-button");

  if (container) {
    window.google.accounts.id.renderButton(container, {
      type: googleSignIn === "true" ? "standard" : "icon",
      theme: "outline",
      size: "large",
      text: googleSignIn === "true" ? "continue_with" : "",
      logo_alignment: "center",
    });
  } else {
    console.error("Google button container not found!");
  }
};

const handleCredentialResponse = async (response, router, handleError) => {
  if (!response || !response.credential) {
    console.error("Invalid response from Google Sign-In:", response);
    return;
  }

  console.log("redirecting to dashboard after google signIn verified");
  // console.log("Encoded JWT ID token:", response.credential);

  try {
    const sendToken = await axios.post(
      `${apiUrl}/auth/google-signin`,
      {},
      {
        headers: {
          Authorization: `Bearer ${response.credential}`,
        },
      }
    );

    setToken(response.credential);

    // console.log({ sendToken });

    const { userName, userRole, email } = sendToken.data;

    Object.entries({
      fullname: userName,
      userRole,
      isOtpVerified: "true",
    }).forEach(([key, value]) => localStorage.setItem(key, value));

    router.push("/dashboard");

    setAuthCookie(localStorage.getItem("fullname"), email);

    localStorage.setItem("is_sign_in_with_google", "true");
  } catch (error) {
    console.error("Error while sign in with google: ", error);
    if (
      error.response &&
      error.response.data &&
      error.response.data.userFound === false
    ) {
      handleError(
        "There was a problem logging in. Check your email or create an account."
      );
    }
  }
};

export const signUpWithGoogle = (router, role, handleError) => {
  console.log("calling function....");
  console.log("role in googlesignup", role);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      console.log("Google Sign-Up response received...");
      handleSignupCredentialResponse(response, router, handleError, role);
    },
    auto_select: false,
  });

  const container = document.querySelector(".google-button");

  if (container) {
    window.google.accounts.id.renderButton(container, {
      type: "icon",
      theme: "outline",
      size: "large",
      text: "",
      logo_alignment: "center",
    });
  } else {
    console.error("Google signup button container not found!");
  }
};

const handleSignupCredentialResponse = async (
  response,
  router,
  handleError,
  role
) => {
  if (!response || !response.credential) {
    console.error("Invalid response from Google Sign-Up:", response);
    return;
  }
  // console.log("Encoded JWT ID token:", response.credential);

  try {
    const sendToken = await axios.post(
      `${apiUrl}/auth/google-signup`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${response.credential}`,
        },
      }
    );

    router.push("/login");
    console.log("response:", sendToken);
  } catch (error) {
    console.error("Error while sign in with google: ", error);
    if (
      error.response &&
      error.response.data &&
      error.response.data.userFound === true
    ) {
      handleError(
        "The email you entered is already in use. Please try logging in."
      );
    }
  }
};
