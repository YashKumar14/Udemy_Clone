import { createStore } from "vuex";

const STORAGE_KEY = "selectedCourses";
const MAX_COURSES = 10;

export default createStore({
  state: {
    selectedCourses: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
  },
  getters: {
    storedCourses: (state) => state.selectedCourses,
  },
  mutations: {
    ADD_COURSE(state, newCourse) {
      const isSelectedCourseExist = state.selectedCourses.some(
        (c) => c.cid === newCourse.cid
      );

      if (!isSelectedCourseExist) {
        if (state.selectedCourses.length >= MAX_COURSES) {
          state.selectedCourses.shift();
        }
        state.selectedCourses.push(newCourse);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selectedCourses));
    },
    SET_COURSES(state, courses) {
      state.selectedCourses = courses;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    },
  },
  actions: {
    addCourse({ commit }, course) {
      commit("ADD_COURSE", course);
    },
    initializeCourses({ commit }) {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      commit("SET_COURSES", cached);
    },
  },
});
