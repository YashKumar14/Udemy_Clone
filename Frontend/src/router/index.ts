import Business from "@/components/Business.vue";
import Home from "@/views/HomePage.vue";
import Pricing from "@/components/Pricing.vue";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/LoginPage.vue";
import Signup from "@/views/SignupPage.vue";
import Cart from "@/views/Cart.vue";
import VerifyOtp from "@/views/VerifyOtpPage.vue";
import Dashboard from "@/views/DashboardPage.vue";
import Logout from "@/views/LogoutPage.vue";
import { useToken } from "@/utils/useToken.js";
import Course from "@/views/CoursePage.vue";
import store from "@/utils/vueStore.js";
import PageNotFound from "@/views/PageNotFound.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";

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
        navbarPage: "home",
        showNotification: true,
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
      component: Signup,
      meta: {
        defaultTitle: "Log in to continue your learning journey | Udemy",
        navbarPage: "teachOnline",
        showNotification: false,
      },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        defaultTitle: "Log in to continue your learning journey | Udemy",
        navbarPage: "login",
        showNotification: false,
      },
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
      meta: {
        defaultTitle: "Log in to continue your learning journey | Udemy",
        navbarPage: "signup",
        showNotification: false,
      },
    },
    {
      path: "/verify-otp",
      name: "otpVerify",
      component: VerifyOtp,
      meta: {
        defaultTitle: "Log in to continue your learning journey | Udemy",
        navbarPage: "verify-otp",
        showNotification: false,
      },
    },
    // {
    //   path: "/cart",
    //   name: "cart",
    //   component: Cart,
    // },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        defaultTitle:
          "Online Courses - Learn Anything, On Your Schedule | Udemy",
        navbarPage: "dashboard",
        showNotification: true,
      },
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout,
      meta: {
        defaultTitle: "udemy.com/logout/",
        navbarPage: "logout",
        showNotification: false,
      },
    },
    {
      path: "/course/:title/learn",
      name: "course",
      component: Course,
      meta: {
        navbarPage: "course",
        showNotification: true,
      },
    },
    {
      path: "/not-found",
      name: "not-found",
      component: PageNotFound,
      meta: {
        defaultTitle: "Page Not Found | Udemy",
        navbarPage: "not-found",
        showNotification: false,
      },
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: PrivacyPolicy,
      meta: {
        defaultTitle: "Privacy Policy | Udemy",
        navbarPage: "privacy-policy",
        showNotification: false,
      },
    },
    // Must be LAST in the array, since Vue matches top-to-bottom
    {
      // Catch-all for undefined routes (shows the invalid URL in the bar)
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: PageNotFound,
      meta: {
        defaultTitle: "Page Not Found | Udemy",
        navbarPage: "not-found",
        showNotification: false,
      },

      // Uncomment redirect → always normalizes to /not-found
      // redirect: { name: "not-found" },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { token, removeToken } = useToken();
  const isOtpVerified = localStorage.getItem("isOtpVerified") === "true";
  const userRole = localStorage.getItem("userRole");

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
    if (userRole === "learner") {
      console.log("Redirecting to dashboard");
      return next("/dashboard");
    } else if (userRole === "instructor") {
      console.log("Redirecting to instructor dashboard");
      return next("/instructor-dashboard");
    }
  }

  if (
    (userRole === "learner" && to.path === "/instructor-dashboard") ||
    (userRole === "instructor" && to.path === "/dashboard")
  ) {
    return next("/not-found");
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

  if (
    from.path === "/verify-otp" &&
    !["/verify-otp", "/dashboard", "/instructor-dashboard"].includes(to.path)
  ) {
    console.log("redirecting from verify-otp to dashboard");
    removeToken();
  }

  next();
});

router.afterEach((to) => {
  const selectedCourses = store.getters.storedCourses?.length
    ? store.getters.storedCourses
    : JSON.parse(localStorage.getItem("selectedCourses") || "[]");

  let pageTitle = to.meta.defaultTitle as string | undefined;

  if (to.name === "course") {
    const course = selectedCourses.find(
      (course: any) => course.cst === to.params.title
    );

    if (course) pageTitle = `${course.ct} | Udemy`;
  }
  document.title =
    pageTitle || "Online Courses - Learn Anything, On Your Schedule | Udemy";
});

export default router;
