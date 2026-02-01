import { createStore } from "vuex";

const STORAGE_KEY = "selectedCourses";
const MAX_COURSES = 10;

export default createStore({
  state: {
    // selectedCourses: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
    selectedCourses: [],
  },

  getters: {
    storedCourses: (state) => state.selectedCourses,
  },

  mutations: {
    ADD_COURSE(state, newCourse) {
      const { selectedCourses } = state;

      const isSelectedCourseExist = selectedCourses.some(
        (c) => c.cid === newCourse.cid,
      );

      if (!isSelectedCourseExist) {
        if (selectedCourses.length >= MAX_COURSES) {
          selectedCourses.shift();
        }

        selectedCourses.push(newCourse);
      }

      // localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedCourses));
    },
    SET_COURSES(state, courses) {
      state.selectedCourses = courses;
      // localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    },
  },

  actions: {
    addCourse({ commit, state }, course) {
      commit("ADD_COURSE", course);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedCourses));
    },
    initializeCourses({ commit }) {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      commit("SET_COURSES", cached);
    },
  },
});
