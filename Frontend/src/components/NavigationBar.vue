<template>
  <div class="navbar" v-if="loading">
    <router-link to="/" id="logo">
      <img
        src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg"
        alt="udemy"
        width="94"
        height="34"
      />
    </router-link>

    <a-input
      id="search"
      v-model:value="searchValue"
      placeholder="Search for anything"
      @pressEnter=""
      :style="searchStyles"
    >
      <template #prefix>
        <SearchOutlined :style="{ color: '#9da3a7' }" />
      </template>
    </a-input>
  </div>

  <div class="navbar" v-else>
    <router-link to="/">
      <img
        src="https://frontends.udemycdn.com/frontends-homepage/staticx/udemy/images/v7/logo-udemy.svg"
        alt="udemy"
        width="94"
        height="34"
      />
    </router-link>

    <a-dropdown>
      <a class="ant-dropdown-link">Categories</a>

      <template #overlay>
        <a-menu>
          <a-menu-item v-for="{ id, title } in values" :key="id">
            <a-sub-menu
              :key="id"
              :title="title"
              @mouseenter="coursesSubCategories(id)"
            >
              <template
                v-for="{ id: subId, title: subTitle } in subValues"
                :key="subId"
              >
                <a-sub-menu
                  :title="subTitle || subCategory"
                  @mouseenter="coursesSuperSubCategories(subId)"
                >
                  <a-menu-item
                    :style="{ color: '#6a6f73', fontWeight: 'bold' }"
                  >
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
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <a-input
      id="search"
      v-model:value="searchValue"
      placeholder="Search for anything"
      @pressEnter=""
      :style="searchStyles"
    >
      <template #prefix>
        <SearchOutlined :style="{ color: '#9da3a7' }" />
      </template>
    </a-input>

    <div id="plans" v-if="!isDashboardPage">
      <router-link id="links" to="/pricing">
        <a-button id="btn">Plans & Pricing</a-button>
      </router-link>
    </div>

    <a-tooltip
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="wrapStyles"
      v-for="data in details"
    >
      <a-button
        id="btn"
        v-if="data.buttons[0] === 'Udemy Business'"
        @click.prevent="navToNewTab(data.url)"
      >
        {{ data.buttons[0] }}
      </a-button>

      <router-link id="links" :to="data.url" v-else>
        <a-button id="btn" v-if="data.buttons[0] !== 'Udemy Business'">
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
          id="data-btn"
          v-if="data.buttons[1] === 'Try Udemy Business'"
          @click.prevent="navToNewTab(data.url)"
        >
          {{ data.buttons[1] }}
        </a-button>

        <router-link id="links" :to="data.url" v-else>
          <a-button id="data-btn">{{ data.buttons[1] }}</a-button>
        </router-link>
      </template>
    </a-tooltip>

    <a-tooltip
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="wrapStyles"
      v-if="isToken && isDashboardPage"
    >
      <template #title>
        Start learning from over 250,000 courses today.
        <router-link
          to="/dashboard"
          id="links"
          @click="reloadPage('dashboard')"
        >
          <a-button id="data-btn"> Browse now </a-button>
        </router-link>
      </template>
      <router-link to="/my-courses" id="links">
        <a-button id="btn">My learning</a-button>
      </router-link>
    </a-tooltip>

    <a-tooltip
      class="wishlist"
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="cartStyles"
      v-if="isToken && isDashboardPage"
    >
      <template #title>
        {{ wishlistDetails }}
        <router-link to="" id="wishlist-link" @click="reloadPage('dashboard')">
          Explore courses
        </router-link>
      </template>
      <router-link to="/wishlist" id="links">
        <HeartOutlined :style="{ fontSize: '24px' }" />
      </router-link>
    </a-tooltip>

    <a-tooltip
      class="cart"
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="cartStyles"
    >
      <template #title>
        {{ cartDetails }}
        <router-link
          to=""
          id="cart-link"
          @click="reloadPage(isToken && isDashboardPage ? 'dashboard' : '')"
          >Keep shopping</router-link
        >
      </template>
      <router-link to="/cart" id="links">
        <ShoppingCartOutlined :style="{ fontSize: '24px' }" />
      </router-link>
    </a-tooltip>

    <a-tooltip
      class="notification"
      color="#fff"
      placement="bottomRight"
      :arrow="false"
      :overlayInnerStyle="notifyStyles"
      v-if="isToken && isDashboardPage"
    >
      <template #title>
        <div class="notify">
          <div id="title">Notifications</div>
          <router-link to="/edit-notifications" id="links"
            >Settings</router-link
          >
        </div>
        <div id="content">No notifications.</div>
      </template>
      <router-link to="/view-notifications">
        <a-badge count="0">
          <BellOutlined :style="{ fontSize: '20px' }" id="links" />
        </a-badge>
      </router-link>
    </a-tooltip>

    <ProfileTooltip v-if="isToken && isDashboardPage"></ProfileTooltip>
    <div class="login" v-if="!isDashboardPage">
      <a-button id="login-btn" @click="reloadPage('login')">Log in</a-button>
    </div>

    <div class="signup" v-if="!isDashboardPage">
      <a-button id="signup-btn" @click="reloadPage('signup')">Sign up</a-button>
    </div>

    <div class="globe" v-if="!isDashboardPage">
      <a-button id="globeBtn" @click="modalVisible = !modalVisible">
        <GlobalOutlined :style="{ fontSize: '18px' }" />
      </a-button>
      <a-modal
        id="modal"
        v-model:open="modalVisible"
        title="Choose a language"
        centered
        :footer="null"
        :bodyStyle="langStyles"
      >
        <router-link
          id="links"
          to="/"
          v-for="lang in languages"
          :key="lang"
          :style="langInnerStyles"
        >
          {{ lang }}
        </router-link>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import {
  ShoppingCartOutlined,
  GlobalOutlined,
  SearchOutlined,
  HeartOutlined,
  BellOutlined,
} from "@ant-design/icons-vue";
import axios from "axios";
import { languages, langStyles, langInnerStyles } from "../utils/languages.js";
import { useRouter } from "vue-router";
import { useToken } from "@/utils/useToken.js";
import ProfileTooltip from "./ProfileTooltip.vue";
import { setIsLogout, localStorageItems } from "@/utils/store.js";
import { getAuthCookie } from "@/utils/cookie.js";

const { isDashboardPage } = defineProps({
  isDashboardPage: {
    type: Boolean,
    required: true,
  },
});

const { token: isToken, fullname, email, isTokenAvailable } = useToken();
const loading = ref(true);
const values = ref([]);
const subValues = ref([]);
const subTopics = ref([]);
const searchValue = ref("");
const modalVisible = ref(false);
const details = ref([]);
const router = useRouter();

const coursesCategories = async () => {
  try {
    const response = await axios.get(
      "https://www.udemy.com/api-2.0/course-categories"
    );
    values.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
};

const coursesSubCategories = async (categoryId) => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/course-categories/${categoryId}/subcategories`
    );
    subValues.value = response.data.results;
  } catch (error) {
    console.error(error);
  }
};

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

const cartDetails = ref("Your cart is empty.");
const wishlistDetails = ref("Your wishlist is empty.");

const searchStyles = computed(() => ({
  width: loading.value ? "600px" : "300px",
  borderRadius: "25px",
  border: "solid #b7b9cd 1px",
  boxShadow: "none",
}));

const wrapStyles = {
  color: "#2d2f31",
  fontWeight: "bold",
  fontSize: "16px",
  textAlign: "center",
  padding: "15px 20px",
  width: "270px",
  lineHeight: "1.2",
  border: "solid #e4e8eb 1px",
  margin: "25px 0px 0px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

const cartStyles = {
  textAlign: "center",
  width: "250px",
  color: "#9da3a7",
  border: "solid #e4e8eb 1px",
  padding: "16px",
  whiteSpace: "nowrap",
  margin: "28px 0px 0px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

const notifyStyles = {
  textAlign: "center",
  width: "270px",
  color: "#2f2d31",
  border: "solid #e4e8eb 1px",
  padding: "16px",
  margin: "28px 0px 0px",
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
}

#navbar:hover,
button {
  cursor: pointer;
}

.ant-dropdown-link:hover {
  cursor: pointer;
  color: #5022c3;
}

#links {
  text-decoration: none;
  color: #2d2f31;
  font-weight: 700;
}

#wishlist-link:hover,
#cart-link:hover,
#links:hover,
#btn:hover {
  color: #5022c3;
}

#wishlist-link,
#cart-link {
  display: block;
  margin-top: 15px;
  text-align: center;
  color: #a435f0;
  font-size: 14px;
  font-weight: 700;
}

#btn {
  border: none;
  box-shadow: none;
  padding: 0;
}

#data-btn {
  width: 100%;
  background-color: #2d2f31;
  margin-top: 15px;
  padding: 10px 0px 30px;
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  border: none;
}

#signup-btn {
  background-color: #2d2f31;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 15px 30px;
  border: solid #2d2f31 1px;
}

#login-btn {
  background-color: #fff;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 20px 30px;
  border: solid #2d2f31 1px;
}

#login-btn:hover {
  background-color: #d1d7dc;
  color: #2d2f31;
}

#signup-btn:hover {
  background-color: #3e4143;
}

#globeBtn {
  width: 40px;
  height: 40px;
  padding: 10px;
  background-color: #fff;
  border: solid #2d2f31 1px;
}

#globeBtn:hover {
  background-color: #d1d7dc;
  color: #2d2f31;
}

#logo {
  position: absolute;
  left: 30px;
}

.notify {
  display: flex;
  justify-content: space-between;
}

#title {
  color: #2d2f31;
  font-weight: 700;
  font-size: 16px;
}

#content {
  color: #595c73;
  font-size: 16px;
  font-weight: 400;
  padding: 16px 0px 0px;
}
</style>
