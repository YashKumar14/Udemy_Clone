<template>
  <div class="footer" ref="footerRoot">
    <div id="logo">
      <span>
        Top companies choose
        <router-link to="/business">Udemy Business</router-link>
        to build in-demand career skills.
      </span>
      <div class="images">
        <img v-for="image in images" :src="image" :key="image" />
      </div>
    </div>
    <hr />
    <div class="links">
      <ul v-for="(list, index) in linksData" :key="index">
        <li v-for="(subtopic, topicIndex) in list.topics" :key="topicIndex">
          <router-link :to="subtopic.url">{{ subtopic.topic }}</router-link>
        </li>
      </ul>

      <a-button id="globeBtn" @click="modalVisible = !modalVisible">
        <GlobalOutlined :style="{ fontSize: '18px' }" />
        <span>English</span>
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

    <div class="bottom">
      <div id="udemy-logo">
        <router-link to="/">
          <img :src="udemyLogoImg" alt="udemy" width="94" height="34" />
        </router-link>
        <span id="copy-right">© {{ year }} Udemy, Inc.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GlobalOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { languages, langStyles, langInnerStyles } from "../utils/languages.js";
import { images } from "@/jsonData/logos.json";
import linksData from "@/jsonData/links.json";

const footerRoot = ref(null);

defineExpose({
  footerRoot,
});

const modalVisible = ref(false);
const udemyLogoImg = ref(
  "https://www.udemy.com/staticx/udemy/images/v7/logo-udemy-inverted.svg"
);
const year = new Date().getFullYear();
</script>

<style scoped>
.footer {
  background-color: #1c1d1f;
  color: #fff;
  padding: 0;
}

#logo {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 24px;
  justify-content: space-between;
  align-items: center;
}

#logo span {
  padding: 12px 24px 12px 0;
}

img {
  margin: 12px 24px 12px 0;
}

hr {
  border: 1px solid #3e4143;
}

ul {
  list-style: none;
  margin: 0px;
  padding: 0px 40px 0px 0px;
}

#logo {
  font-weight: bold;
}

span a {
  text-decoration: none;
  color: #c0c4fc;
}

span a:hover {
  text-decoration: underline;
}

li {
  margin: 10px;
}

li a {
  text-decoration: none;
  padding: 4px 0;
  color: #fff;
}

li:hover {
  text-decoration: underline;
}

.links {
  display: flex;
  flex-wrap: wrap;
  padding: 24px 24px 0;
  justify-content: space-between;
}

#globeBtn {
  border-color: #fff;
  color: #fff;
  background-color: #1c1d1f;
  height: 3rem;
  width: 120px;
  padding: 0 16px 0 4px;
}

#globeBtn span {
  padding: 0 0 0 4px;
  font-weight: bold;
}

#links {
  text-decoration: none;
  color: #2d2f31;
}

#links:hover {
  color: #5022c3;
}

.bottom {
  padding: 64px 24px 32px;
}

#udemy-logo {
  margin: 0px;
  padding: 0px;
  display: flex;
  justify-content: space-between;
}

#udemy-logo a {
  margin: 0px;
  height: 25px;
}

#copy-right {
  height: 20px;
  padding: 15px 0;
}
</style>
