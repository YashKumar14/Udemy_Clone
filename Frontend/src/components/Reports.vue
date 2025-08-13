<template>
  <a-skeleton :loading="loading" active :paragraph="{ rows: 2 }">
    <div class="reports">
      <div class="content">
        <div id="heading">
          {{ details.heading }}
        </div>

        <div id="para" v-html="details.description"></div>
        <router-link to="#">
          <span>{{ details.contentUrlText }}</span>
          <ArrowRightOutlined :style="{ padding: '0 0 0 4px' }" />
        </router-link>
      </div>

      <div class="image">
        <img
          :src="details.image.url"
          :alt="details.image.altText"
          width="95%"
        />
      </div>
    </div>
  </a-skeleton>
</template>

<script setup>
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import reportData from "@/jsonData/reports.json";
import { ref } from "vue";

const loading = ref(true);
const details = ref(reportData.data.dynamicWebContent);

setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.reports {
  display: grid;
  grid-template-columns: auto auto;
  gap: 24px;
  margin: 0px 0px 0px 24px;
  align-items: center;
}

.image {
  display: flex;
  max-width: fit-content;
  height: auto;
  float: right;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px 0px;
  font-weight: 400;
  line-height: 1.4;
  font-size: 1.6rem;
  color: #2d2f31;
  max-width: 19rem;
}

#heading {
  display: block;
  font-weight: 700;
  line-height: 1.25;
  font-size: 30px;
}

#para {
  display: block;
  font-weight: 400;
  font-size: 18px;
}

a {
  border: solid #2d2f31 1px;
  border-radius: 5px;
  height: 50px;
  margin: 24px 0px 0px;
  padding: 0px 12px;
  font-size: 16px;
  background-color: transparent;
  text-decoration: none;
  font-weight: 700;
  color: #2d2f31;
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
}

a:hover {
  background-color: #e4e8eb;
}
</style>
