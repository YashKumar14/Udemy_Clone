<template>
  <a-tooltip
    color="#fff"
    :arrow="false"
    placement="bottomRight"
    :overlayInnerStyle="wrapStyles"
  >
    <a-avatar :size="32" :style="avatarStyle">
      {{ avatarText }}
    </a-avatar>

    <template #title>
      <div id="hover-username">
        <router-link to="/edit-profile" id="profile">
          <div id="user-avatar">
            <a-avatar :size="64" :style="avatarStyle">
              {{ avatarText }}
            </a-avatar>
          </div>
          <div id="user-details">
            <p id="user-name">{{ fullname }}</p>
            <p id="user-email">{{ email }}</p>
          </div>
        </router-link>
      </div>

      <div id="data" v-for="({ topics }, index) in data" :key="index">
        <ul v-for="({ url, topic }, subIndex) in topics" :key="subIndex">
          <li>
            <div
              id="globeBtn"
              v-if="topic === 'Language'"
              @click="modalVisible = !modalVisible"
            >
              <div id="topic">
                {{ topic }}
              </div>
              <div id="modal">
                <span>English</span>
                <GlobalOutlined
                  id="modal"
                  :style="{ fontSize: '14px', padding: '0px 0px 0px 4px' }"
                />
                <a-modal
                  id="modal"
                  v-model:open="modalVisible"
                  title="Choose a language"
                  centered
                  :footer="null"
                  :bodyStyle="langStyles"
                  :zIndex="1070"
                >
                  <router-link
                    id="lang-links"
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
            <router-link
              :to="url"
              id="links"
              v-else-if="topic === 'Logout'"
              @click.prevent="logout"
            >
              <div>
                {{ topic }}
              </div>
            </router-link>
            <router-link :to="url" id="links" v-else>
              <div>
                {{ topic }}
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <div id="hoverContent">
        <router-link to="/business" id="business">
          <div>
            <p id="title">Udemy Business</p>
            <p id="content">Bring learning to your company</p>
          </div>
          <ExportOutlined :style="{ fontSize: '18px', color: '#2f2d31' }" />
        </router-link>
      </div>
    </template>
  </a-tooltip>
</template>

<script setup>
import { useToken } from "@/utils/useToken.js";
import { ref } from "vue";
import { data } from "@/jsonData/dashboardProfileData.json";
import { ExportOutlined, GlobalOutlined } from "@ant-design/icons-vue";
import { languages, langStyles, langInnerStyles } from "../utils/languages.js";
import { useRouter } from "vue-router";

const {
  token: isToken,
  email,
  isTokenAvailable,
  removeToken,
  stopTokenExpirationCheck,
} = useToken();
const avatarText = ref("");
const isBadge = ref(true);
const modalVisible = ref(false);
const router = useRouter();
const fullname = localStorage.getItem("fullname");

isTokenAvailable();
const nameDetails = () => {
  const names = fullname.toUpperCase().split(" ");
  avatarText.value =
    names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : fullname.toUpperCase().slice(0, 2);
};

const logout = () => {
  removeToken();
  stopTokenExpirationCheck();
  router.push("/logout");
};

const avatarStyle = {
  display: "flex",
  color: "#fff",
  backgroundColor: "#1d1e27",
  fontWeight: 700,
  fontSize: isBadge ? "14px" : "21px",
};

const wrapStyles = {
  color: "#2d2f31",
  fontWeight: "bold",
  fontSize: "16px",
  padding: "0px",
  width: "270px",
  lineHeight: "1.2",
  border: "solid #e4e8eb 1px",
  margin: "25px 0px 0px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

nameDetails();
</script>

<style scoped>
#profile {
  display: flex;
  border-bottom: 1px solid #d1d2e0;
  padding: 16px;
}

#user-avatar {
  width: 30%;
}

#user-details {
  width: 70%;
  line-height: 1.2;
}

#user-name {
  color: #2f2d31;
  font-weight: 700;
  font-size: 16px;
  margin: 0;
}

ul {
  list-style: none;
  padding: 0px;
  margin: 0px;
}

#user-email {
  font-size: 12px;
  color: #595c73;
  margin: 4px 0px 0px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

#data {
  border-bottom: 1px solid #d1d2e0;
  padding: 8px 0px;
}

#data a {
  color: #303141;
  font-size: 14px;
  font-weight: 400;
}

ul li {
  display: block;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

ul li:hover {
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}

ul li:hover div,
ul li a:hover,
ul li:hover #topic,
ul li:hover .anticon {
  color: #6d28d2;
}

#globeBtn #modal,
#globeBtn #modal:hover {
  color: #2f2d31;
}

#business {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  font-size: 16px;
}

#title {
  color: #2f2d31;
  margin: 0px;
  font-weight: 700;
}

#globeBtn:hover,
#hoverContent:hover,
#hover-username,
#hoverContent:hover #title,
#hover-username:hover #user-details #user-name {
  color: #6d28d2;
}

#hoverContent,
#hover-username {
  display: block;
  position: relative;
}

#content {
  color: #595c73;
  margin: 4px 0px 0px;
  font-size: 14px;
  font-weight: 400;
}

#globeBtn {
  display: flex;
  justify-content: space-between;
  border: none;
  width: 100%;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
}

#lang-links {
  text-decoration: none;
  color: #2d2f31;
}

#lang-links:hover {
  color: #5022c3;
}
</style>
