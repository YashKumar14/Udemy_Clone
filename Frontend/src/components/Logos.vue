<template>
  <div class="main">
    <a-skeleton :loading="loading" active :paragraph="{ rows: 0 }">
      <h2>{{ logos.heading }}</h2>
    </a-skeleton>
    <div class="list">
      <ul>
        <a-skeleton
          :loading="loading"
          active
          :paragraph="{ rows: 0 }"
          v-for="(logo, index) in logos.contents.slice(0)"
          :key="index"
        >
          <li>
            <img :src="logo.image.url" :alt="logo.image.altText" />
          </li>
        </a-skeleton>
      </ul>
    </div>
  </div>
</template>

<script setup>
import logosData from "@/jsonData/logoImages.json";
import { ref } from "vue";

const loading = ref(true);
const logos = logosData.data.dynamicWebContent;
setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
h2 {
  margin: 0 0 024px;
  color: #6a6f73;
  font-size: 20px;
  font-weight: 400;
  max-width: 100%;
  text-align: center;
}

ul {
  list-style: none;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(4, 4fr);
  grid-gap: 1.6rem;
  justify-content: space-between;
  padding: 0px;
  margin: 0px;
}

.main {
  padding: 32px 24px;
}

.list {
  margin: 0px;
  max-width: none;
  align-self: normal;
}

li {
  display: flex;
  justify-self: center;
  align-items: center;
  justify-content: center;
}
</style>
