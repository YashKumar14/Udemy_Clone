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
        <a-spin
          tip="Loading..."
          :spinning="spinning"
          class="custom-spin"
          size="large"
        >
          <div id="heading">
            <h1>{{ loginData.heading }}</h1>
          </div>

          <div class="error-alert" v-if="errorMessage && !isLogout">
            <WarningFilled :style="{ fontSize: '24px' }" />
            <span>
              <h1>
                {{ errorMessage }}
              </h1>
            </span>
          </div>

          <div id="form-details">
            <form>
              <div
                class="input floating-label"
                v-for="field in loginData.fields"
                v-if="!isLogout"
              >
                <input
                  :class="{
                    'input-error':
                      (field.name === 'email' && errorMessage) ||
                      validationError,
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
                    id="warning-icon"
                    v-if="
                      field.name === 'email' &&
                      (errorMessage || validationError)
                    "
                  />
                </label>
                <div class="validate-err-alert" v-if="validationError">
                  {{ validationError }}
                </div>
              </div>

              <div v-else>
                <div v-if="!googleSignIn">
                  <a-avatar :size="64" :style="{ backgroundColor: '#2f2d31' }">
                    <template #icon>
                      <UserOutlined />
                    </template>
                  </a-avatar>
                  <h1 id="username">Welcome Back, {{ authInfo.username }}</h1>
                  <div id="mail">
                    We'll email
                    <span id="useremail">{{ authInfo.useremail }}</span> a code
                    for a secure passwordless log-in.
                  </div>
                </div>
              </div>
              <div></div>

              <div
                class="custom-google-btn"
                v-if="state.isLogout && googleSignIn"
                id="google-button"
              ></div>
              <div id="btn" v-else>
                <a-button type="primary" @click="login">
                  <MailFilled style="font-size: 20px" />
                  {{ loginData.button }}
                </a-button>
              </div>
            </form>
          </div>

          <a-divider id="options" v-if="!isLogout">
            {{ loginData.options }}
          </a-divider>

          <div id="social-media" v-if="!isLogout">
            <ul>
              <li v-for="(url, logo) in images" :key="logo">
                <button :id="`${logo}-button`">
                  <router-link to="">
                    <img :src="url" :alt="logo" width="24" height="24" />
                  </router-link>
                </button>
              </li>
            </ul>
          </div>

          <div id="another-ways" :style="wrapStyle">
            <div id="login-diff-account" v-if="isLogout">
              <router-link to="" @click="loginToDifferentAccount">
                {{ loginData.anotherAccount }}
              </router-link>
            </div>
            <div id="signup" v-html="loginData.accountNotExist"></div>

            <div id="login">
              <router-link to="">{{ loginData.otherOption }}</router-link>
            </div>
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MailFilled, UserOutlined, WarningFilled } from "@ant-design/icons-vue";
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import imagesData from "@/jsonData/loginFormPictures.json";
import loginData from "@/jsonData/loginData.json";
import { useToken } from "@/utils/useToken.js";
import { state } from "@/utils/store.js";
import { getAuthCookie, removeAuthCookie } from "@/utils/cookie.js";
import { signInWithGoogle } from "@/utils/googleSignin.js";

const { setToken, startTokenExpirationCheck } = useToken();
const images = ref("");
const errorMessage = ref("");
const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
const router = useRouter();
const validationError = ref("");
let noOfSentOtps = 0;
const spinning = ref(false);
const googleSignIn = localStorage.getItem("is_sign_in_with_google");
console.log("apiUrl", apiUrl);
const isLogout = computed(() => state.isLogout);

const authCookie = getAuthCookie();
const authInfo = ref("");

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

images.value = {
  google: "https://cdn-teams-slug.flaticon.com/google.jpg",
  facebook: "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
  twitter: "https://cdn-icons-png.flaticon.com/128/0/747.png",
};

watch(
  () => formData.value.email,
  (newEmail, oldEmail) => {
    validationError.value = "";
    errorMessage.value = "";
  }
);

const handlePressEnter = (e) => {
  e.preventDefault();
  login();
};

const login = async () => {
  if (formData.value.email !== "") {
    spinning.value = true;
  }
  localStorage.setItem("noOfSentOtps", noOfSentOtps);
  if (formData.value.email === "") {
    validationError.value = "Please fill out an email address.";
    return;
  }
  try {
    validationError.value = "";
    const response = await axios.post(`${apiUrl}/login`, {
      email: formData.value.email,
    });

    const authToken = response.data.token;
    localStorage.setItem("fullname", response.data.name);

    setToken(authToken);
    startTokenExpirationCheck();

    localStorage.setItem("noOfSentOtps", ++noOfSentOtps);

    spinning.value = false;
    router.push("/verify-otp");
  } catch (error) {
    if (!error.response.data.userfound) {
      spinning.value = false;
      errorMessage.value =
        "There was a problem logging in. Check your email or create an account.";
    }
  }
};

const loginToDifferentAccount = () => {
  formData.value.email = "";
  state.isLogout = false;
  removeAuthCookie();

  localStorage.removeItem("is_sign_in_with_google");

  setTimeout(() => {
    signInWithGoogle(router, (error) => {
      errorMessage.value = error;
    });
    router.push("/login");
  }, 10);
};

const wrapStyle = {
  margin: "60px 0px 0px",
};

onMounted(() => {
  if (!state.isLogout || googleSignIn) {
    signInWithGoogle(router, (error) => {
      errorMessage.value = error;
    });
  }
});
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

  .right .body #heading h1 {
    font-size: 30px;
    line-height: 1.2;
    color: #2d2f31;
    margin: 0px 0px 30px;
  }
}

#heading h1 {
  font-size: 34px;
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

#warning-icon {
  font-size: 16px;
  margin-left: 5px;
  color: #c20d00;
}
#btn button {
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

#options {
  color: #595c73;
  font-size: 14px;
  margin: 0px 0px 24px;
}

#social-media button {
  /* border: solid 1px #2d2f31; */
  border: none;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  gap: 2.4rem;
  justify-content: center;
  padding: 0px;
  margin: 0px;
}

#img-list {
  gap: 2rem;
}

#login-diff-account,
#signup,
#login {
  padding: 16px 0px;
  background-color: #f7f9fa;
}

#login-diff-account,
#signup {
  border-bottom: solid 1px #d1d7dc;
}

#login-diff-account a,
:deep(#signup a),
#login a {
  color: #5022c3;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.4rem;
  text-decoration-color: #af72fd;
}

#login-diff-account a:hover,
:deep(#signup a):hover,
#login a:hover {
  color: #8b2dc9;
}

#btn :hover {
  background-color: #8b2dc9;
  cursor: pointer;
}

:deep(.custom-spin .ant-spin-dot i) {
  background-color: #a435f0;
}

:deep(.custom-spin) {
  color: #a435f0;
}

#username,
#mail {
  font-size: 16px;
  margin: 10px 0px 24px;
}

#username,
#useremail {
  font-weight: 700;
}

.custom-google-btn {
  width: 100%;
  border: 1px solid #2f2d31;
  border-radius: 5px;
  padding: 0px;
  margin: 20px 0px 0px;
}
</style>
