<template>
  <a-popover
    color="#fff"
    :arrow="false"
    trigger="hover"
    placement="bottomRight"
    :align="{ offset: [20, 28] }"
    :overlayInnerStyle="wrapStyles"
  >
    <a-avatar :size="32" class="profile-badge small-badge">
      {{ avatarText }}
    </a-avatar>

    <template #title>
      <router-link to="/edit-profile" class="user-profile">
        <div class="user-avatar">
          <a-avatar :size="64" class="profile-badge large-badge">
            {{ avatarText }}
          </a-avatar>
        </div>

        <div class="user-details">
          <p class="user-name">{{ fullname }}</p>
          <p class="user-email">{{ email }}</p>
        </div>
      </router-link>

      <a-list :data-source="data" :split="false" class="outer-list">
        <template #renderItem="{ item }">
          <a-list-item class="outer-list-item">
            <a-list
              :data-source="item.topics"
              :split="false"
              class="inner-list"
            >
              <template #renderItem="{ item }">
                <a-list-item class="inner-list-item">
                  <a-button
                    type="primary"
                    class="globe-btn"
                    @click="handleLanguagesModal"
                    v-if="item.topic === 'Language'"
                  >
                    {{ item.topic }}

                    <div class="lang-modal">
                      <span>{{ selectedLanguage }}</span>
                      <GlobalOutlined class="globe-icon" />

                      <LanguagesModal
                        ref="languagesModal"
                        @selectedLanguage="getSelectedLanguage"
                      />
                    </div>
                  </a-button>

                  <a-button
                    type="primary"
                    @click.prevent="handleLogout"
                    v-else-if="item.topic === 'Logout'"
                  >
                    {{ item.topic }}
                  </a-button>

                  <router-link :to="item.url" v-else>
                    <a-button type="primary">
                      {{ item.topic }}
                    </a-button>
                  </router-link>
                </a-list-item>
              </template>
            </a-list>
          </a-list-item>
          <a-divider class="divider" />
        </template>
      </a-list>

      <router-link to="/business" class="udemy-business">
        <div>
          <p class="title">Udemy Business</p>
          <p class="content">Bring learning to your company</p>
        </div>

        <ExportOutlined class="export-icon" />
      </router-link>
    </template>
  </a-popover>
</template>

<script setup>
import { useToken } from "@/utils/useToken.js";
import { defineAsyncComponent, ref } from "vue";
import { data } from "@/jsonData/dashboardProfileData.json";
import { ExportOutlined, GlobalOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";

const LanguagesModal = defineAsyncComponent(() =>
  import("@/components/LanguagesModal.vue")
);

const { email, isTokenAvailable } = useToken();
const avatarText = ref("");
const fullname = localStorage.getItem("fullname");
const languagesModal = ref(null);
const selectedLanguage = ref("English");
const { removeToken, stopTokenExpirationCheck } = useToken();
const router = useRouter();

isTokenAvailable();
const nameDetails = () => {
  const names = fullname.toUpperCase().split(" ");
  avatarText.value =
    names.length > 1
      ? names[0][0] + names[names.length - 1][0]
      : fullname.toUpperCase().slice(0, 2);
};

const handleLanguagesModal = async () => {
  if (languagesModal.value) {
    languagesModal.value.handleModal();
  }
};

const getSelectedLanguage = (language) => {
  console.log("selected language", language);
  selectedLanguage.value = language;
};

const handleLogout = () => {
  console.log("handleLogout");
  removeToken();
  stopTokenExpirationCheck();
  router.push("/logout");
};

const wrapStyles = {
  color: "#2d2f31",
  fontWeight: "bold",
  fontSize: "16px",
  padding: "0px",
  width: "270px",
  lineHeight: "1.2",
  border: "solid #e4e8eb 1px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
};

nameDetails();
</script>

<style scoped>
.user-profile {
  display: flex;
  border-bottom: 1px solid #d1d2e0;
  padding: 16px;
}

.profile-badge {
  display: flex;
  color: #fff;
  background-color: #1d1e27;
  font-weight: 700;
}

.small-badge {
  font-size: 14px !important;
}

.large-badge {
  font-size: 21px !important;
}

.user-avatar {
  width: 30%;
}

.user-details {
  width: 70%;
  line-height: 1.2;
  padding-left: 10px;
}

.user-name {
  color: #2f2d31;
  font-weight: 700;
  font-size: 16px;
  margin: 0;
}

.user-email {
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

.globe-btn .lang-modal,
.globe-btn .lang-modal:hover {
  color: #2f2d31;
}

.udemy-business {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  font-size: 16px;
}

.title {
  color: #2f2d31;
  margin: 0px;
  font-weight: 700;
}

.globe-btn:hover,
.user-profile:hover .user-details .user-name,
.udemy-business:hover .title {
  color: #6d28d2;
}

.content {
  color: #595c73;
  margin: 4px 0px 0px;
  font-size: 14px;
  font-weight: 400;
}

.globe-btn {
  display: flex;
  justify-content: space-between;
  border: none;
  width: 100%;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
}

.export-icon {
  font-size: 18px;
  color: #2f2d31;
}

.ant-list.inner-list .ant-list-item.inner-list-item {
  padding: 8px 16px !important;
}

.ant-list .ant-list-item {
  display: block !important;
}

.ant-list.outer-list .ant-list-item.outer-list-item {
  padding: 8px 0px !important;
}

.ant-list-item.outer-list-item:hover {
  background-color: rgba(0, 0, 0, 0);
}

.ant-list-item.inner-list-item:hover {
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}

.ant-list-item.inner-list-item:hover .ant-btn-primary,
.ant-list-item.inner-list-item .ant-btn-primary:hover {
  color: #6d28d2 !important;
}

.divider {
  margin: 0px !important;
}

.globe-icon {
  font-size: 14px;
  padding: 0px 0px 0px 4px;
  color: #2f2d31 !important;
}

.ant-btn-primary {
  padding: 0px;
  color: #2f2d31;
  /* font-size: 14px;
  font-weight: 400; */
  height: 20px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  box-shadow: none;
}

.ant-btn-primary:hover {
  background-color: rgba(0, 0, 0, 0);
}
</style>
