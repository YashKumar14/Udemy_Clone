<template>
  <div class="trusted-company-logos">
    <a-skeleton :loading="loading" active :paragraph="{ rows: 0 }">
      <h2>{{ logos.heading }}</h2>
    </a-skeleton>

    <div class="list">
      <a-list :data-source="logos.contents" :grid="{ gutter: 8, column: 4 }">
        <template #renderItem="{ item }">
          <a-skeleton :loading="loading" active :paragraph="{ rows: 0 }">
            <a-list-item :key="item?.image.url">
              <a-image
                :src="item?.image.url"
                :alt="item?.image.altText"
                :preview="false"
              />
            </a-list-item>
          </a-skeleton>
        </template>
      </a-list>
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
.trusted-company-logos {
  padding: 32px 24px;
}

h2 {
  margin: 0px;
  color: #6a6f73;
  font-size: 20px;
  font-weight: 400;
  max-width: 100%;
  text-align: center;
}

:deep(.list .ant-row .ant-col .ant-list-item) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  margin-block-end: 5px;
}
</style>
