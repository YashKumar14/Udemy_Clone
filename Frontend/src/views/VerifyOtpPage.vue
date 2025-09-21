<template>
  <div class="main">
    <picture class="image">
      <source
        :media="img.media"
        v-for="img in imagesData.pictures"
        :srcset="img.imageUrl"
      />

      <img :src="imagesData.pictures[1].imageUrl" />
    </picture>

    <div class="right">
      <div class="body">
        <h1 class="heading">Check your inbox</h1>

        <div class="title">
          Enter the 6-digit code we sent to
          <span class="user-email">{{ email }}</span>
          to finish your login.
        </div>

        <div class="error-alert" v-if="errorMessage">
          <WarningFilled class="error-warning-icon" />
          <h1>
            {{ errorMessage }}
          </h1>
        </div>

        <div class="msg-alert" v-if="sentMessage">
          <CheckCircleOutlined class="check-icon" />

          <h1>
            {{ sentMessage }}
          </h1>
        </div>

        <a-form>
          <div class="input-block">
            <a-input
              :class="{ input: true, 'input-error': validationError }"
              type="text"
              placeholder="6-digit-code"
              v-model:value="otp"
              :style="{ boxShadow: 'none' }"
              @pressEnter="handlePressEnter"
            >
              <template #prefix>
                <LockFilled class="lock-icon" />
              </template>
            </a-input>

            <div class="validate-err-alert" v-if="validationError">
              {{ validationError }}
            </div>
          </div>

          <a-button
            type="primary"
            :loading="loading"
            @click.prevent="otpVerification"
            class="login-btn"
          >
            Log in
          </a-button>

          <a-button class="resend-otp-countdown" type="text" v-if="counting">
            Didn't received code?
            <b> Resend code in {{ countDown }} secs.</b>
          </a-button>

          <a-button
            class="resend-otp-btn"
            type="link"
            v-if="!counting"
            @click="resendOtp"
          >
            Resend Code
          </a-button>
        </a-form>

        <a-button
          type="link"
          class="login-diff-account"
          @click="loginToDifferentAccount"
        >
          Log in to a different account
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  WarningFilled,
  LockFilled,
  CheckCircleOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import imagesData from "@/jsonData/loginFormPictures.json";
import { useToken } from "@/utils/useToken.js";
import {
  setAuthCookie,
  removeAuthCookie,
  getAuthCookie,
} from "@/utils/cookie.js";
import { state, localStorageItems } from "@/utils/store.js";

const { email, isTokenAvailable, token } = useToken();
const errorMessage = ref("");
const otp = ref("");
const router = useRouter();
const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
const validationError = ref("");
const countDownInterval = ref(null);
const countDown = ref(10);
const counting = ref(true);
const loading = ref(false);
const currentRoute = router.currentRoute.value.path;
const sentMessage = ref("");

watch(otp, (newOtp) => {
  validationError.value = "";
  errorMessage.value = "";
});

const authCookie = getAuthCookie();
const authInfo = ref("");

if (authCookie) {
  authInfo.value = authCookie;
  state.isLogout = true;
}

const handlePressEnter = (e) => {
  e.preventDefault();
  otpVerification();
};

const otpVerification = async () => {
  if (otp.value === "" || otp.value.length < 6) {
    validationError.value = "Please enter a valid 6-digit code.";
    return;
  }

  loading.value = true;

  const payload = {
    email: email.value,
    otp: otp.value,
  };

  try {
    const response = await axios.post(
      `${apiUrl}/verifyOtp`,
      payload,

      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    console.log("response data::", response.data);

    const { userRole, success } = response.data;

    localStorage.setItem("userRole", userRole);

    setTimeout(() => {
      if (success === true) {
        localStorage.setItem("isOtpVerified", "true");
        loading.value = false;
      }

      const navTopath =
        userRole === "learner" ? "/dashboard" : "/instructor-dashboard";

      router.push(navTopath);

      setAuthCookie(localStorage.getItem("fullname"), email.value);
    }, 600);

    localStorage.removeItem("otpVerifyPageLoaded");
  } catch (error) {
    if (!error.response.data.success) {
      loading.value = false;
      validationError.value =
        "The code you entered is invalid. Please try again.";
    }
  }
};

const startCountDown = () => {
  countDown.value = 30;
  counting.value = true;
  countDownInterval.value = setInterval(() => {
    countDown.value--;
    if (countDown.value == 0) {
      clearInterval(countDownInterval);
      counting.value = false;
    }
  }, 1000);
};

const resendOtp = async () => {
  if (sentMessage.value !== "") {
    sentMessage.value = "";
  }

  try {
    const response = await axios.post(`${apiUrl}/login`, {
      email: email.value,
    });
    console.log(response);

    if (response.data.success === true) {
      sentMessage.value = "Code resent!";
      startCountDown();
    }
  } catch (error) {
    console.error("error msg", error.response);
    if (error.response.status === 429) {
      errorMessage.value = error.response.data.msg;
      setTimeout(() => {
        router.push({
          path: "/login",
          query: { redirectFrom: encodeURIComponent(currentRoute) },
        });
        localStorage.setItem("errorMsg", errorMessage.value);
      }, 5000);

      ["authToken", "otpVerifyPageLoaded", "userRole"].forEach((item) =>
        localStorage.removeItem(item)
      );
    } else {
      console.log("An error occurred while resending the OTP.");
    }
  }
};

const checkPageLoading = () => {
  const isPageLoadedBefore = localStorage.getItem("otpVerifyPageLoaded");

  if (isPageLoadedBefore) {
    router.push({
      path: "/login",
      query: { redirectFrom: encodeURIComponent(currentRoute) },
    });
    localStorageItems.forEach((item) => localStorage.removeItem(item));
  } else {
    localStorage.setItem("otpVerifyPageLoaded", "true");
  }
};

const loginToDifferentAccount = () => {
  state.isLogout = false;
  removeAuthCookie();
  router.push({
    path: "/login",
    query: { redirectFrom: encodeURIComponent(currentRoute) },
  });
};

isTokenAvailable();
startCountDown();
checkPageLoading();
</script>

<style scoped>
.main {
  padding: 64px 24px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.6rem;
}

.image {
  grid-column: span 6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right {
  grid-column: 8 / span 4;
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 980px) {
  .main {
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto auto auto;
  }

  .image {
    grid-column: 4 / span 6;
    margin: 0 auto;
  }

  .right {
    grid-column: 4 / span 6;
    padding-top: 1rem;
  }
}

.heading {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  color: #2d2f31;
  margin: 0px 0px 30px;
}

.body {
  text-align: center;
}

.error-alert {
  display: flex;
  align-items: center;
  background-color: #fcbca0;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 20px;
}

.error-alert h1,
.msg-alert h1 {
  color: #2d2f31;
  text-align: left;
  font-size: 16px;
  margin: 0px 0px 0px 20px;
}

.msg-alert {
  display: flex;
  align-items: center;
  background-color: #ebfaf4;
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 16px;
}

.error-warning-icon {
  font-size: 24px;
}

.check-icon {
  font-size: 26px;
  color: #206241;
}

.validate-err-alert {
  color: #b32d0f;
  display: flex;
  align-items: center;
  padding-top: 8px;
  font-weight: 400;
  font-size: 12px;
}

.input-error {
  border-color: #c20d00 !important;
  outline: none;
}

.title {
  font-weight: 400;
  color: #2d2f31;
  font-size: 16px;
  line-height: 1.4rem;
  margin-bottom: 20px;
}

.title .user-email {
  font-weight: 700;
}

.input-block {
  margin-bottom: 20px;
}

.input-block .input {
  align-items: center;
  border: 1px solid #2d2f31;
  color: #2d2f31;
  height: 3rem;
  width: 100%;
  font-weight: 400;
}

input::placeholder {
  color: #9da3a7;
  font-size: 14px;
}

.input-block .lock-icon {
  font-size: 14px;
  color: #2d2f31;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 37px;
  background-color: #a435f0;
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  width: 100%;
  height: 48px;
}

.login-btn:hover {
  background-color: #8b2dc9;
  cursor: pointer;
}

.resend-otp-btn.ant-btn {
  color: #2d2f31;
  margin: 14px 0px;
  padding: 0px;
  width: fit-content;
  height: 24px;
}

.resend-otp-countdown.ant-btn-text {
  margin: 14px 0px;
  padding: 0px;
  width: 100%;
  cursor: auto;
  height: 24px;
}

.resend-otp-countdown.ant-btn-text:hover {
  background-color: rgba(0, 0, 0, 0);
}

.login-diff-account {
  width: 100%;
  border-radius: 0px;
  height: auto;
  padding: 16px 0px;
  background-color: #f7f9fa;
  line-height: 1.2;
  margin-top: 60px;
}

:deep(.ant-btn-link.login-diff-account span) {
  color: #5022c3;
  font-size: 16px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.4rem;
  text-decoration-color: #af72fd;
}

:deep(.ant-btn-link.login-diff-account span:hover) {
  color: #8b2dc9;
  text-decoration-color: #af72fd;
}
</style>
