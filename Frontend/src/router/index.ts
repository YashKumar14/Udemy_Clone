import Business from "@/components/Business.vue";
import Home from "@/views/Home.vue";
import Pricing from "@/components/Pricing.vue";
import { createRouter, createWebHistory } from "vue-router";
// import TeachOnline from "@/components/TeachOnline.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Cart from "@/views/Cart.vue";
import VerifyOtp from "@/views/VerifyOtp.vue";
import Dashboard from "@/views/Dashboard.vue";
import Logout from "@/views/Logout.vue";
import { useToken } from "@/utils/useToken.js";
import Course from "@/views/Course.vue";
import TeachOnline from "@/views/TeachOnline.vue";

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
      path: "/course/:title",
      name: "course",
      component: Course,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { token } = useToken();
  const isOtpVerified = localStorage.getItem("isOtpVerified") === "true";
  // const selectedCourseId = localStorage.getItem("setSelectedCourseId");

  const selectedCourseTitle = localStorage.getItem("setSelectedCourseTitle");

  if (to.name === "course" && selectedCourseTitle) {
    document.title = `${selectedCourseTitle} | Udemy`;
  } else if (to.meta.defaultTitle) {
    document.title = to.meta.defaultTitle;
  } else {
    document.title =
      "Online Courses - Learn Anything, On Your Schedule | Udemy";
  }

  console.log("Token in beforeEach:", token.value);
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

export default router;
