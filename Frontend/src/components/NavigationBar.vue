<template>
  <div class="navbar">
    <!-- logo -->
    <router-link to="/" :class="{ logo: loading }">
      <a-image
        class="app-logo"
        src="/logo-udemy.svg"
        :preview="false"
        alt="udemy"
        :width="94"
        :height="34"
      />
    </router-link>

    <!-- Course Categories -->
    <a-dropdown v-if="!loading">
      <a class="course-categories">Categories</a>

      <template #overlay>
        <a-menu class="categories-menu">
          <a-sub-menu
            v-for="{ id, title } in values"
            :key="id"
            :title="title"
            @mouseenter="coursesSubCategories(id)"
            :popupClassName="
              isNotificationVisible
                ? 'popup-submenu'
                : 'popup-submenu-closed-notification'
            "
          >
            <template
              v-for="{ id: subId, title: subTitle } in subValues"
              :key="subId"
            >
              <a-sub-menu
                :title="subTitle || subCategory"
                @mouseenter="coursesSuperSubCategories(subId)"
                :popupClassName="
                  isNotificationVisible
                    ? 'popup-submenu'
                    : 'popup-submenu-closed-notification'
                "
              >
                <a-menu-item class="popular-topic-text">
                  Popular topics
                </a-menu-item>

                <a-menu-item
                  v-for="{ id: superId, title: superSubTitle } in subTopics"
                  :key="superId"
                >
                  {{ superSubTitle }}
                </a-menu-item>
              </a-sub-menu>
            </template>
          </a-sub-menu>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- Search bar -->
    <a-input
      :class="loading ? 'search-bar-during-loading' : 'search-bar'"
      v-model:value="searchValue"
      placeholder="Search for anything"
      @pressEnter=""
    >
      <template #prefix>
        <SearchOutlined class="search-icon" />
      </template>
    </a-input>

    <!-- Plans -->
    <div class="plans" v-if="!isDashboardPage && !loading">
      <router-link class="links" to="/pricing">
        <a-button class="btn">Plans & Pricing</a-button>
      </router-link>
    </div>

    <!-- Udemy Business and Teach on Udemy -->
    <a-tooltip
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="wrapStyles"
      v-for="data in details"
      v-if="!loading"
    >
      <a-button
        class="btn"
        v-if="data.buttons[0] === 'Udemy Business'"
        @click.prevent="navToNewTab(data.url)"
      >
        {{ data.buttons[0] }}
      </a-button>

      <router-link class="links" :to="data.url" v-else>
        <a-button class="btn" v-if="data.buttons[0] !== 'Udemy Business'">
          {{ data.buttons[0] }}
        </a-button>
      </router-link>

      <template #title>
        <div v-if="data.buttons[0] === 'Udemy Business'">
          {{ data.text }}
        </div>

        <div v-else>
          {{ data.text }}
        </div>

        <a-button
          class="data-btn"
          v-if="data.buttons[1] === 'Try Udemy Business'"
          @click.prevent="navToNewTab(data.url)"
        >
          {{ data.buttons[1] }}
        </a-button>

        <router-link class="links" :to="data.url" v-else>
          <a-button class="data-btn">{{ data.buttons[1] }}</a-button>
        </router-link>
      </template>
    </a-tooltip>

    <!-- My learning -->
    <a-tooltip
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="wrapStyles"
      v-if="isToken && isDashboardPage && !loading"
    >
      <template #title>
        Start learning from over 250,000 courses today.

        <router-link
          to="/dashboard"
          class="links"
          @click="reloadPage('dashboard')"
        >
          <a-button class="data-btn"> Browse now </a-button>
        </router-link>
      </template>

      <router-link to="/my-courses" class="links">
        <a-button class="btn">My learning</a-button>
      </router-link>
    </a-tooltip>

    <!-- Explore Courses -->
    <a-tooltip
      class="wishlist"
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="cartStyles"
      v-if="isToken && isDashboardPage && !loading"
    >
      <template #title>
        {{ wishlistDetails }}

        <router-link
          to=""
          class="wishlist-link"
          @click="reloadPage('dashboard')"
        >
          Explore courses
        </router-link>
      </template>

      <router-link to="/wishlist" class="links">
        <HeartOutlined class="heart-icon" />
      </router-link>
    </a-tooltip>

    <!--  Cart -->
    <a-tooltip
      class="cart"
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="cartStyles"
      v-if="!loading"
    >
      <template #title>
        {{ cartDetails }}

        <router-link
          to=""
          class="cart-link"
          @click="reloadPage(isToken && isDashboardPage ? 'dashboard' : '')"
        >
          Keep shopping
        </router-link>
      </template>

      <router-link to="/cart" class="links">
        <ShoppingCartOutlined class="cart-icon" />
      </router-link>
    </a-tooltip>

    <!-- Notifications -->
    <a-tooltip
      class="notification"
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="notifyStyles"
      v-if="isToken && isDashboardPage && !loading"
    >
      <template #title>
        <div class="notify">
          <div class="title">Notifications</div>

          <router-link to="/edit-notifications" class="links">
            Settings
          </router-link>
        </div>

        <div class="content">No notifications.</div>
      </template>

      <router-link to="/view-notifications">
        <a-badge count="0">
          <BellOutlined class="bell-icon links" />
        </a-badge>
      </router-link>
    </a-tooltip>

    <!-- Profile -->
    <ProfileTooltip v-if="isToken && isDashboardPage && !loading">
    </ProfileTooltip>

    <!-- Login Button -->
    <div class="login" v-if="!isDashboardPage && !loading">
      <a-button id="login-btn" @click="reloadPage('login')">Log in</a-button>
    </div>

    <!-- Signup Button -->
    <div class="signup" v-if="!isDashboardPage && !loading">
      <a-button id="signup-btn" @click="reloadPage('signup')">Sign up</a-button>
    </div>

    <!-- Languages Button -->
    <div class="globe" v-if="!isDashboardPage && !loading">
      <a-button id="globe-btn" @click="handleLanguagesModal">
        <GlobalOutlined class="globe-icon" />
      </a-button>

      <LanguagesModal ref="languagesModal" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, watch } from "vue";
import { ref } from "vue";
import {
  ShoppingCartOutlined,
  GlobalOutlined,
  SearchOutlined,
  HeartOutlined,
  BellOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToken } from "@/utils/useToken.js";
import { setIsLogout, localStorageItems } from "@/utils/store.js";
import { getAuthCookie } from "@/utils/cookie.js";
import debounce from "lodash/debounce";

const ProfileTooltip = defineAsyncComponent(() =>
  import("./ProfileTooltip.vue")
);

const LanguagesModal = defineAsyncComponent(() =>
  import("@/components/LanguagesModal.vue")
);

const { isDashboardPage, isNotificationVisible } = defineProps({
  isDashboardPage: {
    type: Boolean,
    required: true,
  },
  isNotificationVisible: {
    type: Boolean,
    required: false,
  },
});

const { token: isToken, isTokenAvailable } = useToken();
const loading = ref(true);
const values = ref([]);
const subValues = ref([]);
const subTopics = ref([]);
const searchValue = ref("");
const details = ref([]);
const router = useRouter();
const cartDetails = ref("Your cart is empty.");
const wishlistDetails = ref("Your wishlist is empty.");
const languagesModal = ref(null);

const coursesCategories = debounce(async () => {
  try {
    const response = await axios.get(
      "https://www.udemy.com/api-2.0/course-categories"
    );
    values.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
}, 100);

const coursesSubCategories = debounce(async (categoryId) => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/course-categories/${categoryId}/subcategories`
    );
    subValues.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
}, 100);

const coursesSuperSubCategories = async (subCategoryId) => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/course-subcategories/${subCategoryId}/labels`
    );
    subTopics.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
};

details.value = [
  {
    text: "Get your team access to over 27,000 top Udemy courses, anytime, anywhere.",
    url: "/business",
    buttons: ["Udemy Business", "Try Udemy Business"],
  },
  {
    text: "Turn what you know into an opportunity and reach millions around the world.",
    url: "/teachOnline",
    buttons: ["Teach on Udemy", "Learn more"],
  },
];

const navToNewTab = (url) => {
  window.open(router.resolve(url).href, "_blank");
};

const reloadPage = (type) => {
  const currentPath = router.currentRoute.value.path;
  const targetPath = `/${type}`;
  // console.log(currentPath);
  // console.log(targetPath);

  if (currentPath === targetPath) {
    window.location.reload();
  } else {
    if (isToken && !isDashboardPage) {
      console.log(isToken);
      localStorageItems.forEach((item) => localStorage.removeItem(item));
      console.log("cleared localstorage");
    }

    getAuthCookie() ? setIsLogout(true) : setIsLogout(false);
    router.push(targetPath);
  }
};

const handleLanguagesModal = () => {
  if (languagesModal.value) {
    languagesModal.value.handleModal(); // Call the child method directly using ref
  }
};

const wrapStyles = {
  color: "#2d2f31",
  fontWeight: "bold",
  fontSize: "16px",
  textAlign: "center",
  padding: "15px 20px",
  width: "270px",
  lineHeight: "1.2",
  border: "solid #e4e8eb 1px",
  marginTop: "25px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

const cartStyles = {
  textAlign: "center",
  width: "250px",
  color: "#9da3a7",
  border: "solid #e4e8eb 1px",
  padding: "16px",
  whiteSpace: "nowrap",
  marginTop: "28px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

const notifyStyles = {
  textAlign: "center",
  width: "270px",
  color: "#2f2d31",
  border: "solid #e4e8eb 1px",
  padding: "16px",
  marginTop: "28px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

setTimeout(() => {
  loading.value = false;
}, 2500);

isTokenAvailable();
coursesCategories();
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 5px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(6, 17, 118, 0.08),
    0 4px 12px rgba(6, 17, 118, 0.08);
  z-index: 100;
  position: relative;
  font-weight: 700;
}

.navbar,
.links {
  color: #2d2f31;
}

.navbar:hover,
.course-categories:hover {
  cursor: pointer;
}

:deep(.ant-image .ant-image-img) {
  vertical-align: unset !important;
}

.anticon-search.search-icon {
  color: #9da3a7;
}

.course-categories {
  font-weight: 400;
}

.ant-dropdown .ant-dropdown-menu.categories-menu {
  min-width: 300px;
  min-height: 550px;
  top: 30px;
  padding: 10px;
}

.links {
  text-decoration: none;
}

.course-categories:hover,
.wishlist-link:hover,
.cart-link:hover,
.links:hover,
.btn:hover {
  color: #5022c3;
  border-color: #fff;
}

.search-bar-during-loading,
.search-bar {
  border-radius: 25px;
  border: solid #b7b9cd 1px;
  box-shadow: none;
}

.search-bar-during-loading {
  width: 600px;
}

.search-bar {
  width: 300px;
}

.wishlist-link,
.cart-link {
  display: block;
  margin-top: 15px;
  text-align: center;
  color: #a435f0;
  font-size: 14px;
}

.heart-icon,
.anticon-shopping-cart.cart-icon {
  font-size: 24px;
}

.bell-icon {
  font-size: 20px;
}

.btn {
  border: none;
  box-shadow: none;
  padding: 0px;
}

.data-btn,
#signup-btn,
#login-btn {
  font-size: 14px;
  font-weight: 700;
  background-color: #2d2f31;
  color: #fff;
}

.data-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px 0px 30px;
  border: none;
}

.data-btn:hover {
  color: #fff !important;
  border-color: #2f2d31 !important;
}

#signup-btn {
  padding: 10px 15px 30px;
}

#login-btn {
  background-color: #fff !important;
  padding: 10px 20px 30px;
  color: #2d2f31 !important;
}

#login-btn:hover,
#globe-btn:hover {
  background-color: #d1d7dc !important;
  color: #2d2f31;
}

#signup-btn:hover {
  background-color: #3e4143;
}

#login-btn,
#signup-btn,
#globe-btn {
  border: solid #2d2f31 1px;
}

#globe-btn {
  width: 40px;
  height: 40px;
  padding: 10px;
  background-color: #fff;
}

.anticon-global.globe-icon {
  font-size: 18px;
}

.logo {
  position: absolute;
  left: 30px;
}

.notify {
  display: flex;
  justify-content: space-between;
}

.title,
.content {
  font-size: 16px;
}

.content {
  color: #595c73;
  font-weight: 400;
  padding-top: 16px;
}
</style>

<style>
.popup-submenu .ant-dropdown-menu,
.popup-submenu-closed-notification .ant-dropdown-menu {
  min-width: 300px;
  min-height: 550px;
  margin: -2px 0px 0px 4px;
  padding: 8px;
}

.popup-submenu {
  top: 165px !important;
}

.popup-submenu-closed-notification {
  top: 86px !important;
}

.popular-topic-text span.ant-dropdown-menu-title-content {
  color: #6a6f73 !important;
  font-weight: 700 !important;
}
</style>
