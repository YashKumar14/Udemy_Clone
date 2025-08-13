<template>
  <div class="main">
    <div class="image">
      <picture>
        <source
          :media="img.media"
          v-for="img in imagesData.pictures"
          :srcset="img.imageUrl"
        />
        <img :src="imagesData.pictures[1].imageUrl" />
      </picture>
    </div>

    <div class="right">
      <div class="body">
        <div id="heading">
          <h1>Check your inbox</h1>
        </div>
        <div id="title">
          <span>
            Enter the 6-digit code we sent to
            <span id="email">{{ email }}</span>
            to finish your login.
          </span>
        </div>
        <div class="error-alert" v-if="errorMessage">
          <WarningFilled :style="{ fontSize: '24px' }" />
          <span>
            <h1>
              {{ errorMessage }}
            </h1>
          </span>
        </div>

        <div id="form-details">
          <form>
            <div id="input">
              <span>
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
              </span>
              <div class="validate-err-alert" v-if="validationError">
                {{ validationError }}
              </div>
            </div>

            <div id="btn">
              <a-button type="primary" :loading="loading" v-if="loading" />
              <a-button type="primary" @click.prevent="otpVerification" v-else>
                Log in
              </a-button>
            </div>
            <div>
              <p v-if="counting">
                Didn't received code?
                <b>Resend code in {{ countDown }} secs.</b>
              </p>
              <p v-if="!counting">
                <router-link to="" @click="resendOtp()">
                  Resend Code
                </router-link>
              </p>
            </div>
          </form>
        </div>

        <div>
          <div id="login">
            <router-link to="" @click="loginToDifferentAccount"
              >Log in to a different account</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { WarningFilled, LockFilled } from "@ant-design/icons-vue";
import axios from "axios";
import { computed, ref, watch } from "vue";
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
  } else {
    loading.value = true;
  }
  try {
    const response = await axios.post(
      `${apiUrl}/verifyOtp`,
      {
        email: email.value,
        otp: otp.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    setTimeout(() => {
      if (response.data.success === true) {
        localStorage.setItem("isOtpVerified", "true");
      }
      router.push("/dashboard");
      loading.value = false;
      setAuthCookie(localStorage.getItem("fullname"), email.value);
    }, 600);

    localStorage.removeItem("noOfSentOtps");
    localStorage.removeItem("otpVerifyPageLoaded");
  } catch (error) {
    if (!error.response.data.success) {
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
  let data = localStorage.getItem("noOfSentOtps");

  try {
    if (data >= 3) {
      localStorage.removeItem("noOfSentOtps");
      errorMessage.value =
        "You have Reached Maximum number of attempts. Please try again after 15 minutes";
      // console.log(errorMessage.value);

      setTimeout(() => {
        router.push("/login");
      }, 10000);
      localStorage.removeItem("authToken");
      localStorage.removeItem("otpVerifyPageLoaded");
      return;
    }
    const response = await axios.post(`${apiUrl}/login`, {
      email: email.value,
    });
    // console.log(response);
    ++data;
    localStorage.setItem("noOfSentOtps", data);

    startCountDown();
  } catch (error) {
    console.error(error.response);
  }
};

const checkPageLoading = () => {
  const isPageLoadedBefore = localStorage.getItem("otpVerifyPageLoaded");

  if (isPageLoadedBefore) {
    router.push("/login");
    localStorageItems.forEach((item) => localStorage.removeItem(item));
  } else {
    localStorage.setItem("otpVerifyPageLoaded", "true");
  }
};

const loginToDifferentAccount = () => {
  state.isLogout = false;
  removeAuthCookie();
  router.push("/login");
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

#heading {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: #2d2f31;
}

.body {
  text-align: center;
}

.error-alert {
  display: flex;
  align-items: center;
  background-color: #fcbca0;
  margin: 0px 0px 16px;
  padding: 16px;
  border-radius: 20px;
}

.error-alert span h1 {
  color: #2d2f31;
  text-align: left;
  font-size: 16px;
  margin: 0px 0px 0px 20px;
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

#title {
  font-weight: 400;
  color: #2d2f31;
  font-size: 16px;
  line-height: 1.4rem;
}

#title #email {
  font-weight: 700;
}

#input {
  margin: 20px 0px;
}

#input .input {
  align-items: center;
  border: solid #2d2f31 1px;
  color: #2d2f31;
  height: 3rem;
  width: 100%;
  font-weight: 400;
}

input::placeholder {
  color: #9da3a7;
  font-size: 14px;
}

#input .lock-icon {
  font-size: 14px;
  color: #2d2f31;
}

#btn button {
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

#login {
  padding: 16px 0px;
  background-color: #f7f9fa;
  margin: 60px 0px 0px;
}

#login a {
  color: #5022c3;
  font-weight: bold;
  text-underline-offset: 0.4rem;
}

#btn :hover {
  background-color: #8b2dc9;
  cursor: pointer;
}
</style>
