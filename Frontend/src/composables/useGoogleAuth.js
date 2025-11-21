import { ref } from "vue";
import axios from "axios";
import { setAuthCookie } from "@/utils/cookie.js";
import { useToken } from "@/utils/useToken";

const apiUrl = import.meta.env.VITE_API_BACKEND_URL;

export const useGoogleAuth = () => {
  const errorMessage = ref("");

  const { setToken } = useToken();

  const signInWithGoogle = async (idToken, router) => {
    const sendToken = await axios.post(
      `${apiUrl}/auth/google-signin`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const { userName, userRole, email, token } = sendToken.data;

    setToken(token);

    console.log({ sendToken });

    Object.entries({
      fullname: userName,
      userRole,
      isOtpVerified: "true",
    }).forEach(([key, value]) => localStorage.setItem(key, value));

    if (userRole === "learner") {
      router.push("/dashboard");
    } else {
      router.push("/instructor-dashboard");
    }

    setAuthCookie(userName, email);

    localStorage.setItem("is_sign_in_with_google", "true");

    return sendToken.data;
  };

  const handleGoogleResponse = async (response, mode, router, role) => {
    if (!response || !response.credential) {
      console.error(`Invalid response from Google ${mode}: `, response);
      return;
    }

    console.log(`redirecting to dashboard after google ${mode} verified`);

    const idToken = response.credential;

    try {
      if (mode === "signup") {
        await axios.post(
          `${apiUrl}/auth/google-signup`,
          { role },
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
      }

      await signInWithGoogle(idToken, router);
    } catch (error) {
      console.error("Error while sign in with google: ", error);

      if (error?.response?.data?.userFound) {
        errorMessage.value =
          "The email you entered is already in use. Please try logging in.";
      } else {
        errorMessage.value =
          "There was a problem logging in. Check your email or create an account.";
      }
    }
  };

  const initGoogleAuth = (mode, router, role = null) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        console.log("Google Sign-Up response received...");
        handleGoogleResponse(response, mode, router, role);
      },
      auto_select: false,
    });

    const container = document.querySelector(".google-button");

    if (!container) {
      console.error("Google signup button container not found!");
      return;
    }

    if (mode === "signup") {
      window.google.accounts.id.renderButton(container, {
        type: "icon",
        theme: "outline",
        size: "large",
        text: "",
        logo_alignment: "center",
      });
      return;
    }

    const googleSignIn = localStorage.getItem("is_sign_in_with_google");

    window.google.accounts.id.renderButton(container, {
      type: googleSignIn === "true" ? "standard" : "icon",
      theme: "outline",
      size: "large",
      text: googleSignIn === "true" ? "continue_with" : "",
      logo_alignment: "center",
    });
  };

  return {
    initGoogleAuth,
    errorMessage,
  };
};
