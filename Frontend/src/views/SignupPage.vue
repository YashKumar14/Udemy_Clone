<template>
  <div class="main">
    <picture class="image">
      <source
        :media="img.media"
        v-for="img in imagesData.pictures"
        :srcset="img.imageUrl"
      />
      <a-image :src="imagesData.pictures[1].imageUrl" :preview="false" />
    </picture>

    <div class="right">
      <div class="heading">
        <h1>{{ signupData[role].heading }}</h1>
        <h2 v-if="signupData[role]?.subheading" class="subheading">
          {{ signupData[role]?.subheading }}
        </h2>
      </div>

      <div class="error-alert" v-if="errorMessage">
        <WarningFilled class="error-warning-icon" />
        <h1>
          {{ errorMessage }}
        </h1>
      </div>

      <form @keydown.enter="handlePressEnter">
        <div
          class="input floating-label"
          v-for="field in signupData[role].fields"
          :key="field.name"
        >
          <input
            :class="{
              'input-error':
                errors[field.name] || (field.name === 'email' && errorMessage),
            }"
            :type="field.type"
            v-model="formData[field.name]"
            :id="field.name"
            @focus="isFocused[field.name] = true"
            @blur="checkFocus(field)"
            @input="
              field.type === 'password' &&
                checkPasswordStrength(formData[field.name])
            "
            :autocomplete="isAutoComplete(field.type)"
            :required="field.required"
          />

          <label
            :class="{ active: isFocused[field.name] || formData[field.name] }"
            :for="field.name"
          >
            {{ field.label }}
            <WarningFilled
              class="warning-icon"
              v-if="
                (field.name === 'email' && errorMessage) || errors[field.name]
              "
            />
          </label>

          <EyeFilled
            class="eye-icon"
            v-show="field.type === 'password' && onInput && !isEyeIconVisible"
            @click="showPassword"
          />

          <EyeInvisibleFilled
            class="eye-icon"
            v-show="field.type === 'password' && onInput && isEyeIconVisible"
            @click="showPassword"
          />

          <span v-if="errors[field.name]" class="error-message">
            {{ errors[field.name] }}
          </span>
        </div>

        <a-progress
          class="custom-progress"
          :percent="strength * 25"
          :steps="4"
          :stroke-color="'#2d2f31'"
          :size="[42, 4]"
          :format="() => strengthText"
          status="normal"
        />

        <a-checkbox v-model:checked="checked" class="check-box">
          {{ signupData[role].checkBox }}
        </a-checkbox>

        <a-button type="primary" @click="validateForm" class="signup-btn">
          <MailFilled class="mail-icon" v-if="role === 'instructor'" />
          {{ signupData[role].button }}
        </a-button>
      </form>

      <a-divider class="other-options" style="border-color: #d1d2e0">
        {{ signupData[role].options }}
      </a-divider>

      <a-list
        size="small"
        :split="false"
        :data-source="images"
        item-layout="vertical"
        class="buttons-list"
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

      <div
        class="terms-conditions"
        v-html="signupData[role].termsAndConditions"
      ></div>

      <a-button
        type="link"
        class="login-link"
        v-html="signupData[role].accountExist"
        @click.prevent="handleClick"
      >
      </a-button>
    </div>
  </div>
</template>

<script setup>
import {
  WarningFilled,
  EyeFilled,
  EyeInvisibleFilled,
  MailFilled,
} from "@ant-design/icons-vue";
import { computed, onMounted, reactive, ref, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import imagesData from "@/jsonData/loginFormPictures.json";
import signupData from "@/jsonData/signupData.json";
import bcrypt from "bcryptjs";
import { signUpWithGoogle } from "@/utils/googleSignin.js";

const checked = ref(true);
const errorMessage = ref("");
const strength = ref(0);
const strengthText = ref("");
const router = useRouter();
const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
const onInput = ref(false);
const isEyeIconVisible = ref(false);
const images = ref("");
const route = useRoute();

const role = computed(() =>
  route.path.includes("signup") ? "learner" : "instructor"
);

const formData = ref({
  fullName: "",
  email: "",
  password: "",
});

const isFocused = ref({
  fullName: false,
  email: false,
  password: false,
});

const errors = reactive({});

images.value = [
  { logo: "google", url: "/google.jpg" },
  {
    logo: "facebook",
    url: "/facebook.png",
  },
  { logo: "apple", url: "/apple.png" },
];

const checkFocus = (field) => {
  if (!formData.value[field.name]) {
    isFocused.value[field.name] = false;
  }
};

const isAutoComplete = (type) => {
  if (type === "email") {
    return "on";
  }
  return "off";
};

const showPassword = () => {
  isEyeIconVisible.value = !isEyeIconVisible.value;

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
};

const checkPasswordStrength = (password) => {
  onInput.value = true;

  if (password.length === 0) {
    onInput.value = false;
  }

  strength.value = 0;
  const freqCharRegEx = /(.)\1{3,}/.test(password);

  if (
    checkSequence(password, 4) === false &&
    password.length >= 4 &&
    /[a-z]/.test(password) &&
    freqCharRegEx === false
  )
    strength.value++;
  if (
    checkSequence(password, 4) === false &&
    password.length >= 4 &&
    /[A-Z]/.test(password) &&
    freqCharRegEx === false
  )
    strength.value++;
  if (
    checkSequence(password, 4) === false &&
    password.length >= 4 &&
    /[!@#$%^&*,.?]/.test(password)
  )
    strength.value++;
  if (
    checkSequence(password, 4) === false &&
    password.length >= 6 &&
    /[0-9]/.test(password) &&
    freqCharRegEx === false
  )
    strength.value++;

  strengthText.value =
    [
      "Too Weak",
      "Could be stronger",
      "Strong password",
      "Very strong password",
    ][strength.value - 1] || "";
};

const checkSequence = (input, sequentialNumber) => {
  let seqKeys = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
    "1234567890",
    "abcdefghijklmnopqrstuvwxyz",
  ];

  for (const row of seqKeys) {
    if (row.includes(input.toLowerCase()) && input.length > sequentialNumber) {
      return true;
    }
  }
  return false;
};

watch(
  () => formData.value.email,
  (newValue, oldValue) => {
    errorMessage.value = "";
  }
);

signupData[role.value].fields.forEach((field) => {
  watch(
    () => formData.value[field.name],
    (newValue) => {
      // console.log(`Field ${field.name} changed to: ${newValue}`);
      if (errors[field.name]) {
        errors[field.name] = "";
      }
    }
  );
});

const handlePressEnter = (e) => {
  e.preventDefault();
  validateForm();
};

const signup = async () => {
  try {
    console.log("role", role.value);

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(formData.value.password, salt);

    const response = await axios.post(`${apiUrl}/signup`, {
      fullname: formData.value.fullName,
      email: formData.value.email,
      password: hashedPassword,
      role: role.value,
    });

    router.push({
      path: "/login",
      query: { redirectFrom: encodeURIComponent(route.path) },
    });
  } catch (error) {
    console.error(error);
    if (error.response?.data?.isEmailExist) {
      errorMessage.value =
        "The email you entered is already in use. Please try logging in.";
    }
  }
};

const validateForm = () => {
  signupData[role.value].fields.forEach((field) => {
    if (field.required && !formData.value[field.name]) {
      errors[field.name] = `${field.label} is required!`;
    }
  });

  if (Object.values(errors).every((error) => !error)) {
    signup();
  }
};

const handleClick = (event) => {
  const target = event.target;
  if (target.tagName === "A" && target.getAttribute("href") === "/login") {
    event.preventDefault(); // Prevent default browser navigation(Page Reload)
    console.log("routing to /login");
    router.push("/login");
  }
};

onMounted(() => {
  signUpWithGoogle(router, role.value, (error) => {
    errorMessage.value = error;
  });
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
  text-align: center;
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

  .right .heading h1 {
    font-size: 30px;
    line-height: 1.2;
    color: #2d2f31;
    margin: 0px 0px 30px;
  }
}

.heading h1 {
  font-size: 34px;
  font-weight: 700;
}

.heading h1,
.subheading {
  line-height: 1.2;
  color: #2d2f31;
  margin: 0px 0px 30px;
}

.subheading {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
}

.error-alert {
  display: flex;
  align-items: center;
  background-color: #fcbca0;
  margin: 0px 0px 16px;
  padding: 16px;
  border-radius: 20px;
}

.error-alert h1 {
  color: #2d2f31;
  text-align: left;
  font-size: 16px;
  margin: 0px 0px 0px 20px;
}

.error-warning-icon {
  font-size: 24px;
}

.input.floating-label {
  position: relative;
  margin-bottom: 20px;
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

.warning-icon {
  font-size: 16px;
  margin-left: 5px;
  color: #c20d00;
}

.eye-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #303141;
  cursor: pointer;
  font-size: 20px;
}

.check-box {
  padding: 0.8rem 0;
  text-align: left;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #2d2f31;
  border-color: #2d2f31;
}

:deep(.ant-checkbox .ant-checkbox-inner) {
  border: 2px solid #2d2f31 !important;
  border-radius: 0px;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #2d2f31 !important;
  border-color: #2d2f31 !important;
}

:deep(.ant-checkbox-checked:after) {
  border-color: #2d2f31 !important;
}

.signup-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 12px;
  margin: 16px 0px 24px;
  background-color: #a435f0;
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  height: 48px;
  width: 100%;
}

.signup-btn:hover {
  background-color: #8b2dc9;
  cursor: pointer;
}

.mail-icon {
  font-size: 20px;
}

.login-link {
  padding: 16px 0px;
  background-color: #f7f9fa;
  color: #2d2f31;
  width: 100%;
  height: auto;
  line-height: 1.2;
  border-radius: 0px;
  font-size: 16px;
}

.login-link:hover {
  color: #2d2f31;
}

:deep(.login-link a) {
  color: #5022c3;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.4rem;
  text-decoration-color: #af72fd;
}

:deep(.login-link a:hover) {
  color: #8b2dc9;
  text-decoration-color: #af72fd;
}

.other-options {
  color: #595c73;
  font-size: 14px;
  margin: 0px 0px 24px;
}

.buttons-list {
  width: 100%;
}

.social-media {
  border: none;
  box-shadow: none;
  width: 40px;
  height: 40px;
}

:deep(.google-button div:focus-within) {
  outline: 1px solid #dadce0;
  border-radius: 5px;
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

.terms-conditions {
  color: #2d2f31;
  font-size: 12px;
  display: flex;
  margin: 25px 0px;
  justify-content: center;
}

:deep(.terms-conditions a) {
  color: #5022c3;
  text-underline-offset: 0.4rem;
}

:deep(.terms-conditions a:hover) {
  color: #a435f0;
}

.input-error {
  border-color: #c20d00 !important;
  outline: none;
}

.error-message {
  color: #c20d00;
  font-size: 12px;
  font-weight: 400;
  position: absolute;
  bottom: -18px;
  left: 0;
}
</style>
