import { computed, ref, watch } from "vue";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "vue-router";
import { localStorageItems } from "./store";

const token = ref(localStorage.getItem("authToken"));
const email = ref("");
let expirationCheckInterval = null;

export const useToken = () => {
  const router = useRouter();

  const getTokenExpireTime = computed(() => {
    if (token.value) {
      try {
        const decoded = jwtDecode(token.value);
        return decoded.exp * 1000;
      } catch (err) {
        console.error("Error decoding token", err);
      }
    }
    return null;
  });

  console.log(new Date(getTokenExpireTime.value).toString());

  const checkTokenExpiration = () => {
    if (!token.value) {
      return;
    }

    const remainingTime = getTokenExpireTime.value - Date.now();

    if (remainingTime <= 0) {
      localStorageItems.forEach((item) => localStorage.removeItem(item));
      token.value = "";
      email.value = "";
      console.log("Token expired, logging out...");
      router.push("/logout");
      console.log("Token logged out at: ", new Date(Date.now()).toString());

      if (expirationCheckInterval) {
        clearInterval(expirationCheckInterval);
        expirationCheckInterval = null;
      }
    }
  };

  watch(token, () => {
    if (token.value) {
      checkTokenExpiration();
    }
  });

  const startTokenExpirationCheck = () => {
    if (token.value) {
      expirationCheckInterval = setInterval(checkTokenExpiration, 5000);
    }
  };

  const stopTokenExpirationCheck = () => {
    if (expirationCheckInterval) {
      clearInterval(expirationCheckInterval);
      expirationCheckInterval = null;
    }
  };

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem("authToken", newToken);
  };

  const isTokenAvailable = () => {
    if (token.value) {
      try {
        const decoded = jwtDecode(token.value);
        email.value = decoded.email;
      } catch (error) {
        console.error("Invalid token: ", error);
      }
    } else {
      console.warn("Token not found. Please log in again");
    }
  };

  const removeToken = () => {
    localStorageItems.forEach((item) => localStorage.removeItem(item));

    token.value = "";
  };

  return {
    token,
    email,
    isTokenAvailable,
    setToken,
    removeToken,
    startTokenExpirationCheck,
    stopTokenExpirationCheck,
  };
};
