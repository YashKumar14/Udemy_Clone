import { reactive } from "vue";

export const state = reactive({
  isLogout: false,
});

export const setIsLogout = (value) => {
  state.isLogout = value;
};

export const localStorageItems = [
  "otpVerifyPageLoaded",
  "isOtpVerified",
  "authToken",
  "noOfSentOtps",
  "fullname",
];
