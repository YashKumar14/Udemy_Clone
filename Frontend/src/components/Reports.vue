<template>
  <a-skeleton :loading="loading" active :paragraph="{ rows: 2 }">
    <div class="reports">
      <div class="content">
        <div class="heading">
          {{ details.heading }}
        </div>

        <div class="para" v-html="details.description"></div>

        <a-button class="get-report-btn" @click="getReports">
          {{ details.contentUrlText }}
          <ArrowRightOutlined class="arrow-right-icon" />
        </a-button>
      </div>

      <a-image
        class="image"
        :src="details.image.url"
        :alt="details.image.altText"
        width="95%"
        :preview="false"
      />
    </div>
  </a-skeleton>
</template>

<script setup>
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import reportData from "@/jsonData/reports.json";
import { ref } from "vue";
import { useRouter } from "vue-router";

const loading = ref(true);
const details = ref(reportData.data.dynamicWebContent);
const router = useRouter();

const getReports = () => {
  router.push("/");
};

setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.reports {
  display: grid;
  grid-template-columns: auto auto;
  gap: 24px;
  margin-left: 24px;
  align-items: center;
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

.heading {
  display: block;
  font-weight: 700;
  line-height: 1.25;
  font-size: 30px;
}

.para {
  display: block;
  font-weight: 400;
  font-size: 18px;
}

.ant-btn-default.get-report-btn:hover {
  background-color: #e4e8eb;
}

.ant-btn-default.get-report-btn {
  border: solid #2d2f31 1px;
  border-radius: 5px;
  height: 50px;
  font-size: 16px;
  font-weight: 700;
  color: #2d2f31;
  padding: 4px 10px;
  margin-top: 40px;
}

.arrow-right-icon {
  padding-left: 4px;
}
</style>
