<template>
  <BannerSlide :isLogoutPage="true" />

  <a-skeleton-button v-if="mainLoader" active block :style="mainStyle" />

  <a-tabs
    v-model:activeKey="activeKey"
    tab-position="top"
    @change="onTabChange"
    size="large"
    v-else
  >
    <a-tab-pane
      v-for="item in coursesCategories.categories"
      :key="item.id"
      :tab="item.title"
    >
      <CoursesCards
        v-if="coursesCategories.categories.length > 0"
        :isLogoutPage="true"
        :isCoursesRender="true"
        :categoryId="activeKey"
      />
    </a-tab-pane>
  </a-tabs>

  <CoursesCards :isLogoutPage="true" />
</template>

<script setup>
import { ref } from "vue";
import CoursesCards from "@/components/CoursesCards.vue";
import BannerSlide from "@/components/BannerSlide.vue";

const mainLoader = ref(true);

const coursesCategories = {
  categories: [
    {
      id: 268,
      title: "Business",
    },
    {
      id: 269,
      title: "Design",
    },
    {
      id: 273,
      title: "Photography & Video",
    },
    {
      id: 288,
      title: "Development",
    },
    {
      id: 290,
      title: "Marketing",
    },
    {
      id: 294,
      title: "IT & Software",
    },
    {
      id: 296,
      title: "Personal Development",
    },
  ],
};

const activeKey = ref(coursesCategories.categories[0].id);

const onTabChange = (key) => {
  console.log("activeKey", activeKey.value);
  activeKey.value = key;
};

const mainStyle = {
  padding: "18px 24px",
};

setTimeout(() => {
  mainLoader.value = false;
}, 3500);
</script>

<style scoped>
:deep(.ant-tabs-nav) {
  margin: 10px 0px 0px;
  padding: 0px 24px;
}

:deep(.ant-tabs-nav::before) {
  right: 24px !important;
  left: 24px !important;
}

:deep(.ant-tabs-tab .ant-tabs-tab-btn) {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: #595c73 !important;
}

:deep(.ant-tabs .ant-tabs-tab:hover),
/* :deep(.ant-tabs .ant-tabs-tab-btn:focus:not(:focus-visible)), */
:deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #2d2f31 !important;
}

:deep(.ant-tabs-ink-bar) {
  background: #2f2d31 !important;
  height: 3px !important;
}
</style>
