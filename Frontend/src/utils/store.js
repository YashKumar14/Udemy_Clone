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
  // "noOfSentOtps",
  "fullname",
  "userRole",
];

export const selectedCoursesData = (newCourse) => {
  let selectedCourses =
    JSON.parse(localStorage.getItem("selectedCourses")) || [];

  const isSelectedCourseExist = selectedCourses.some(
    (course) => course.id === newCourse.id
  );

  if (!isSelectedCourseExist) {
    selectedCourses.push(newCourse);
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
  }

  console.log("stored courses", localStorage.getItem("selectedCourses"));
};
