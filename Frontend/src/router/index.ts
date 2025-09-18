import Business from "@/components/Business.vue";
import Home from "@/views/Home.vue";
import Pricing from "@/components/Pricing.vue";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Cart from "@/views/Cart.vue";
import VerifyOtp from "@/views/VerifyOtp.vue";
import Dashboard from "@/views/Dashboard.vue";
import Logout from "@/views/Logout.vue";
import { useToken } from "@/utils/useToken.js";
import Course from "@/views/Course.vue";
import TeachOnline from "@/views/TeachOnline.vue";
import store from "@/utils/vueStore.js";
import PageNotFound from "@/views/PageNotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_API_ROUTER_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        defaultTitle:
          "Online Courses - Learn Anything, On Your Schedule | Udemy",
      },
    },
    {
      path: "/pricing",
      name: "pricing",
      component: Pricing,
    },
    {
      path: "/business",
      name: "business",
      component: Business,
    },
    {
      path: "/teachOnline",
      name: "teachOnline",
      component: TeachOnline,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        defaultTitle: "Log in to continue your learning journey | Udemy",
      },
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
      meta: {
        defaultTitle: "Log in to continue your learning journey | Udemy",
      },
    },
    {
      path: "/verify-otp",
      name: "otpVerify",
      component: VerifyOtp,
      meta: {
        defaultTitle: "Log in to continue your learning journey | Udemy",
      },
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        defaultTitle:
          "Online Courses - Learn Anything, On Your Schedule | Udemy",
      },
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout,
      meta: {
        defaultTitle: "udemy.com/logout/",
      },
    },
    {
      path: "/course/:title/learn",
      name: "course",
      component: Course,
    },
    {
      path: "/not-found",
      name: "not-found",
      component: PageNotFound,
      meta: { defaultTitle: "Page Not Found | Udemy" },
    },
    // Must be LAST in the array, since Vue matches top-to-bottom
    {
      // Catch-all for undefined routes (shows the invalid URL in the bar)
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: PageNotFound,
      meta: { defaultTitle: "Page Not Found | Udemy" },

      // Uncomment redirect → always normalizes to /not-found
      // redirect: { name: "not-found" },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { token } = useToken();
  const isOtpVerified = localStorage.getItem("isOtpVerified") === "true";

  console.log("Token in beforeEach:", token.value);

  // Only use knownRoutes.includes(to.path) if you define /not-found explicitly without pathMatch.
  // const knownRoutes = router.getRoutes().map((route) => route.path);

  // if (!knownRoutes.includes(to.path)) {
  //   return next("/not-found");
  // }

  if (
    token.value &&
    isOtpVerified &&
    ["/login", "/signup", "/", "/logout", "/verify-otp"].includes(to.path)
  ) {
    console.log("Redirecting to dashboard");
    return next("/dashboard");
  }

  if (["/dashboard", "/verify-otp"].includes(to.path) && !token.value) {
    console.log("Redirecting to home");
    return next("/");
  }

  if (token.value && isOtpVerified === false && to.path === "/dashboard") {
    console.log("User is on verify-otp but hasn't completed verification");
    localStorage.clear();
    return next("/login");
  }

  next();
});

router.afterEach((to) => {
  const selectedCourses = store.getters.storedCourses?.length
    ? store.getters.storedCourses
    : JSON.parse(localStorage.getItem("selectedCourses") || "[]");

  let pageTitle = to.meta.defaultTitle;

  if (to.name === "course") {
    const course = selectedCourses.find(
      (course) => course.cst === to.params.title
    );

    if (course) pageTitle = `${course.ct} | Udemy`;
  }
  document.title =
    pageTitle || "Online Courses - Learn Anything, On Your Schedule | Udemy";
});

export default router;
