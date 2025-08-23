<template>
  <div class="footer">
    <div class="logo">
      <span>
        Top companies choose
        <router-link to="/business">Udemy Business</router-link>
        to build in-demand career skills.
      </span>

      <div>
        <a-image
          class="images"
          v-for="image in images"
          :src="image"
          :key="image"
          :preview="false"
        />
      </div>
    </div>

    <a-divider class="divider" />

    <div class="links">
      <a-list :grid="{ gutter: 8, column: 3 }" :data-source="linksData">
        <template #renderItem="{ item }">
          <a-list-item>
            <router-link :to="item.url" class="nav-link">
              {{ item.topic }}
            </router-link>
          </a-list-item>
        </template>
      </a-list>

      <a-button class="globe-btn" @click="handleLanguagesModal">
        <GlobalOutlined class="globe-icon" />
        <span>{{ selectedLanguage }}</span>
      </a-button>

      <LanguagesModal
        ref="languagesModal"
        @selectedLanguage="getSelectedLanguage"
      />
    </div>

    <div class="bottom">
      <router-link to="/">
        <a-image
          class="udemy-logo"
          src="/logo-udemy-inverted.svg"
          alt="udemy"
          :width="94"
          :height="34"
          :preview="false"
        />
      </router-link>
      <span class="copy-right">© {{ year }} Udemy, Inc.</span>
    </div>
  </div>
</template>

<script setup>
import { GlobalOutlined } from "@ant-design/icons-vue";
import { defineAsyncComponent, ref } from "vue";
import { images } from "@/jsonData/logos.json";
import linksData from "@/jsonData/links.json";

const LanguagesModal = defineAsyncComponent(() =>
  import("@/components/LanguagesModal.vue")
);

const year = new Date().getFullYear();
const languagesModal = ref(null);
const selectedLanguage = ref("English");

const handleLanguagesModal = () => {
  console.log("languagesModal.value:", languagesModal.value);
  console.log("language object", Object.keys(languagesModal.value || {}));

  if (languagesModal.value) {
    languagesModal.value.handleModal(); // Call the child method directly using ref
  }
};

const getSelectedLanguage = (language) => {
  console.log("selected language", language);
  selectedLanguage.value = language;
};
</script>

<style scoped>
.footer {
  background-color: #1c1d1f;
  color: #fff;
  padding: 0px;
}

.logo {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 24px;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
}

.logo span {
  padding: 12px 24px 12px 0px;
  line-height: 1.2;
}

:deep(.images.ant-image-img) {
  margin: 12px 24px 12px 0px;
  width: auto;
}

.divider {
  border: 1px solid #3e4143 !important;
  margin: 8px 0px !important;
}

:deep(.ant-list .ant-list-item) {
  padding: 0px;
  margin: 4px;
}

span a {
  text-decoration: none;
  color: #c0c4fc;
}

span a:hover {
  text-decoration: underline;
}

.links {
  display: flex;
  flex-wrap: wrap;
  padding: 24px 24px 0px;
  justify-content: space-between;
}

.ant-list {
  width: 85%;
}

.nav-link {
  padding: 0px;
  font-size: 16px;
  color: #fff;
}

.nav-link:hover {
  text-decoration: underline;
}

.globe-btn {
  border-color: #fff;
  color: #fff;
  background-color: #1c1d1f;
  height: 3rem;
  width: 120px;
  padding: 0px 16px 0px 4px;
}

.globe-btn span {
  padding-left: 4px;
  font-weight: 700;
}

.globe-icon {
  font-size: 18px;
}

.ant-btn-default:hover {
  color: #fff;
  border-color: #fff;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px;
  padding: 64px 24px 32px;
}

:deep(.ant-image .ant-image-img) {
  vertical-align: unset !important;
}

.copy-right {
  height: 20px;
  padding: 15px 0px;
}
</style>
