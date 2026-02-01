<template>
  <div class="login-page">
    <picture class="image">
      <source
        :media="img.media"
        v-for="img in imagesData.pictures"
        :srcset="img.imageUrl"
      />

      <img :src="imagesData.pictures[1].imageUrl" />
    </picture>

    <div class="right">
      <a-spin
        tip="Loading..."
        :spinning="spinning"
        class="custom-spin"
        size="large"
      >
        <h1 class="heading">{{ loginData.heading }}</h1>

        <div class="error-alert" v-if="errorMessage">
          <WarningFilled class="error-warning-icon" />
          <h1>
            {{ errorMessage }}
          </h1>
        </div>

        <form>
          <div
            class="input floating-label"
            v-for="field in loginData.fields"
            v-if="!isLogout"
          >
            <input
              :class="{
                'input-error':
                  (field.name === 'email' && errorMessage) || validationError,
              }"
              :type="field.type"
              :name="field.name"
              v-model="formData[field.name]"
              :id="field.name"
              @focus="isFocused[field.name] = true"
              @blur="checkFocus(field)"
              autocomplete="on"
              @keydown.enter="handlePressEnter"
            />

            <label
              :class="{
                active: isFocused[field.name] || formData[field.name],
              }"
              :for="field.name"
            >
              {{ field.label }}
              <WarningFilled
                class="warning-icon"
                v-if="
                  field.name === 'email' && (errorMessage || validationError)
                "
              />
            </label>

            <div class="validate-err-alert" v-if="validationError">
              {{ validationError }}
            </div>
          </div>

          <div v-if="!googleSignIn && isLogout">
            <a-avatar :size="64" class="user-avatar">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>

            <h1 class="username">Welcome Back, {{ authInfo.username }}</h1>

            <div class="mail">
              We'll email
              <span class="useremail">{{ authInfo.useremail }}</span> a code for
              a secure passwordless log-in.
            </div>
          </div>

          <a-button
            :class="{
              'custom-google-btn': true,
              'google-button': true,
              'logout-page-google-btn': googleSignIn && isLogout,
            }"
            v-if="state.isLogout && googleSignIn"
          ></a-button>

          <a-button class="login-btn" v-else type="primary" @click="login">
            <MailFilled class="mail-icon" />
            {{ loginData.button }}
          </a-button>
        </form>

        <a-divider
          class="other-options"
          style="border-color: #d1d2e0"
          v-if="!isLogout"
        >
          {{ loginData.options }}
        </a-divider>

        <a-list
          size="small"
          :split="false"
          :data-source="images"
          item-layout="vertical"
          v-if="!isLogout"
        >
          <template #renderItem="{ item }">
            <a-list-item :key="item.logo">
              <a-button :class="[`${item.logo}-button`, 'social-media']">
                <a-image
                  :src="item.url"
                  :alt="item.logo"
                  :preview="false"
                  :width="24"
                  :height="24"
                />
              </a-button>
            </a-list-item>
          </template>
        </a-list>

        <div class="another-ways">
          <a-button
            type="link"
            class="login-diff-account"
            v-if="isLogout"
            @click="loginToDifferentAccount"
          >
            {{ loginData.anotherAccount }}
          </a-button>

          <a-button
            type="link"
            class="signup"
            v-html="loginData.accountNotExist"
            @click.prevent="handleClick"
          >
          </a-button>

          <a-button type="link" class="login">
            {{ loginData.otherOption }}
          </a-button>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import { MailFilled, UserOutlined, WarningFilled } from "@ant-design/icons-vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import imagesData from "@/jsonData/loginFormPictures.json";
import loginData from "@/jsonData/loginData.json";
import { useToken } from "@/utils/useToken.js";
import { state } from "@/utils/store.js";
import { getAuthCookie, removeAuthCookie } from "@/utils/cookie.js";
import { useGoogleAuth } from "@/composables/useGoogleAuth";

const { setToken, startTokenExpirationCheck } = useToken();
const images = ref([]);
// const errorMessage = ref("");
const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
const router = useRouter();
const validationError = ref("");
const spinning = ref(false);
const googleSignIn = localStorage.getItem("is_sign_in_with_google");

const isLogout = computed(() => state.isLogout);

const authCookie = getAuthCookie();
const authInfo = ref("");
const route = useRoute();
const { initGoogleAuth, errorMessage } = useGoogleAuth();

if (authCookie) {
  authInfo.value = authCookie;
  state.isLogout = true;
}

const formData = ref({
  email: state.isLogout ? authInfo.value.useremail : "",
});

const isFocused = ref({
  email: false,
});

const checkFocus = (field) => {
  if (!formData.value[field.name]) {
    isFocused.value[field.name] = false;
  }
};

images.value = [
  { logo: "google", url: "/google.jpg" },
  {
    logo: "facebook",
    url: "/facebook.png",
  },
  { logo: "apple", url: "/apple.png" },
];

watch(
  () => formData.value.email,
  (newEmail, oldEmail) => {
    validationError.value = "";
    errorMessage.value = "";
  },
);

const handlePressEnter = (e) => {
  e.preventDefault();
  login();
};

const login = async () => {
  if (formData.value.email === "") {
    validationError.value = "Please fill out an email address.";
    return;
  }

  try {
    spinning.value = true;
    validationError.value = "";
    const response = await axios.post(
      `${apiUrl}/login`,
      {
        email: formData.value.email,
      },
      {
        timeout: 180000,
      },
    );

    console.log("response:::", response.data);

    const { userRole, token: authToken, userName } = response.data;
    localStorage.setItem("fullname", userName);

    setToken(authToken);
    startTokenExpirationCheck();

    spinning.value = false;
    router.push("/verify-otp");
  } catch (error) {
    console.log("error response", error?.response);
    spinning.value = false;

    const {
      status,
      data: { block_until, userfound },
    } = error?.response;

    if (!userfound && status !== 429) {
      errorMessage.value =
        "There was a problem logging in. Check your email or create an account.";
    } else if (block_until) {
      const blockUntil = new Date(block_until);
      console.log("blockUntil", blockUntil, "new Date", new Date());
      if (blockUntil > new Date()) {
        let countdownTimer;

        const updateCountdown = () => {
          const remainingTime = Math.ceil(
            (blockUntil - new Date()) / (1000 * 60),
          );
          console.log("remainingTime", remainingTime);
          if (remainingTime <= 0) {
            clearInterval(countdownTimer);
            errorMessage.value = "";
          } else {
            errorMessage.value = `You have reached the maximum number of attempts. Please try again after ${remainingTime} minute${
              remainingTime > 1 ? "s" : ""
            }.`;
          }
        };

        updateCountdown();

        countdownTimer = setInterval(updateCountdown, 1000 * 60);

        onUnmounted(() => {
          clearInterval(countdownTimer);
        });

        return;
      }
    }
  }
};

const handleClick = (event) => {
  const target = event.target;

  if (target.tagName === "A" && target.getAttribute("href") === "/signup") {
    event.preventDefault(); // Prevent default browser navigation(Page Reload)
    console.log("routing to /signup");

    router.push("/signup");
  }
};

const loginToDifferentAccount = () => {
  formData.value.email = "";
  state.isLogout = false;
  removeAuthCookie();

  localStorage.removeItem("is_sign_in_with_google");

  setTimeout(() => {
    initGoogleAuth("signin", router);
  }, 10);
};

onMounted(() => {
  errorMessage.value = localStorage.getItem("errorMsg");
  localStorage.removeItem("errorMsg");

  if (!state.isLogout || googleSignIn) {
    initGoogleAuth("signin", router);
  }

  const redirectFrom = decodeURIComponent(route.query.redirectFrom || "/");

  console.log("decoded", redirectFrom);

  if (redirectFrom === "/teachOnline" || redirectFrom === "/signup") {
    loginToDifferentAccount();
  }
});
</script>

<style scoped>
.login-page {
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
  text-align: center;
}

@media (max-width: 980px) {
  .login-page {
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

  .right .heading {
    font-size: 30px;
    line-height: 1.2;
    color: #2d2f31;
    margin: 0px 0px 30px;
  }
}

.heading {
  font-size: 34px;
  font-weight: 700;
  line-height: 1.2;
  color: #2d2f31;
  margin: 0px 0px 30px;
}

.user-avatar {
  background-color: #2d2f31;
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

.input.floating-label {
  position: relative;
  margin-bottom: 4px;
}

.input.floating-label input {
  width: 100%;
  padding: 20px 40px 10px 16px;
  font-size: 16px;
  border: 1px solid #303141;
  border-radius: 4px;
  outline: none;
  box-shadow: none;
  box-sizing: border-box;
  height: 60px;
  color: #303141;
}

.input.floating-label label {
  position: absolute;
  top: 20px;
  left: 16px;
  font-size: 16px;
  color: #303141;
  font-weight: 700;
  transition: 0.2s ease-in-out;
  pointer-events: none;
  z-index: 1;
}

.input.floating-label label.active {
  top: 10px;
  left: 16px;
  font-size: 14px;
  z-index: 1;
}

.input-error {
  border-color: #c20d00 !important;
  outline: none;
}

.error-warning-icon {
  font-size: 24px;
}

.warning-icon {
  font-size: 16px;
  margin-left: 5px;
  color: #c20d00;
}

.mail-icon {
  font-size: 20px;
}

.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 37px;
  margin: 24px 0px;
  background-color: #a435f0;
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  width: 100%;
  height: 48px;
}

.login-btn:hover {
  background-color: #8b2dc9;
  cursor: pointer;
}

.other-options {
  color: #595c73;
  font-size: 14px;
  margin: 0px 0px 24px;
}

.social-media {
  border: none;
  box-shadow: none;
  width: 40px;
  height: 40px;
}

:deep(.ant-list .ant-list-items) {
  display: flex;
  gap: 2.4rem;
  justify-content: center;
  padding: 0px;
  margin: 0px;
}

:deep(.ant-list-sm .ant-list-item button > div) {
  position: absolute !important;
  left: 0px;
  top: 0px;
}

:deep(.ant-list-sm .ant-list-item button.facebook-button > div),
:deep(.ant-list-sm .ant-list-item button.apple-button > div) {
  position: absolute !important;
  left: 10px;
  top: 7px;
}

:deep(.ant-list-sm .ant-list-item) {
  padding: 0px;
}

.another-ways {
  margin-top: 60px;
}

.login-diff-account,
.signup,
.login {
  width: 100%;
  border-radius: 0px;
  height: auto;
  padding: 16px 0px;
  background-color: #f7f9fa;
  line-height: 1.2;
}

.login-diff-account,
.signup {
  border-bottom: solid 1px #d1d7dc;
}

:deep(.signup span) {
  color: #2d2f31;
}

:deep(.ant-btn-link.login-diff-account span),
:deep(.signup a),
:deep(.login span) {
  color: #5022c3;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.4rem;
  text-decoration-color: #af72fd;
}

:deep(.signup a:hover),
:deep(.ant-btn-link.login-diff-account span:hover),
:deep(.login span:hover) {
  color: #8b2dc9;
  text-decoration-color: #af72fd;
}

:deep(.custom-spin .ant-spin-dot i) {
  background-color: #a435f0;
}

:deep(.custom-spin) {
  color: #a435f0;
}

.username,
.mail {
  font-size: 16px;
  margin: 10px 0px 24px;
}

.username,
.useremail {
  font-weight: 700;
}

.custom-google-btn {
  width: 100%;
  border: 1px solid #2f2d31;
  border-radius: 5px;
  padding: 0px;
  margin-top: 20px;
  height: auto;
}

.custom-google-btn:hover {
  border-color: #2d2f31;
}

:deep(.logout-page-google-btn div:focus-within) {
  outline: none !important;
}

:deep(.google-button div:focus-within) {
  outline: 1px solid #dadce0;
  border-radius: 5px;
}
</style>
