<template>
  <a-skeleton :loading="mainLoader" :active="true">
    <div
      class="dashboard-main"
      v-for="({ title, items }, index) in api"
      :key="index"
    >
      <h2 class="heading">{{ title }}</h2>

      <div class="cards-container">
        <a-col :span="1" class="arrows arrow-left">
          <a-button
            class="arrow-btn left-arrow-btn"
            type="text"
            @click="moveLeft(index)"
            v-show="indices[index].currentIndex > 0"
          >
            <LeftCircleFilled
              :class="[
                'circle-icon',
                'left-circle-icon',
                { 'active-arrow': isArrowHovered[`${index}-left`] },
              ]"
              @mouseenter="isArrowHovered[`${index}-left`] = true"
              @mouseleave="isArrowHovered[`${index}-left`] = false"
            />
          </a-button>
        </a-col>

        <a-row :gutter="12">
          <a-col :span="20">
            <div
              class="cards"
              :style="slideStyle(indices[index].slidePosition)"
            >
              <CardsTooltipComponent
                v-for="(course, itemIndex) in items"
                :key="itemIndex"
                :itemIndex="itemIndex"
                :course="course"
                :index="index"
                :cardsWidth="cardsWidth"
                :loading="false"
                :isLogoutPage="false"
                @click="redirectToCourse(course.id, api, router)"
              />
            </div>
          </a-col>
        </a-row>

        <a-col :span="1" class="arrows arrow-right">
          <a-button
            class="arrow-btn right-arrow-btn"
            type="text"
            @click="moveRight(index)"
            v-show="indices[index].currentIndex < maxIndex(items.length)"
          >
            <RightCircleFilled
              :class="[
                'circle-icon',
                'right-circle-icon',
                { 'active-arrow': isArrowHovered[`${index}-right`] },
              ]"
              @mouseenter="isArrowHovered[`${index}-right`] = true"
              @mouseleave="isArrowHovered[`${index}-right`] = false"
            />
          </a-button>
        </a-col>
      </div>
    </div>
  </a-skeleton>
</template>

<script setup>
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons-vue";
import axios from "axios";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import CardsTooltipComponent from "@/components/CardsTooltipComponent.vue";
import { useToken } from "@/utils/useToken.js";
import { useRouter } from "vue-router";
import { redirectToCourse } from "@/utils/courseFetchApi.js";

const { startTokenExpirationCheck, stopTokenExpirationCheck } = useToken();

const router = useRouter();
const mainLoader = ref(true);
const cardsPerPage = 5;
const cardsWidth = 249;
const api = ref([]);
const indices = reactive({});

const apiParams = {
  context: "subs_featured",
  from: 0,
  page_size: 13,
  item_count: 60,
  source_page: "logged_in_homepage",
  locale: "en_US",
  currency: "inr",
  navigation_locale: "en_US",
  skip_price: true,
};
const isArrowHovered = reactive({});

const coursesApi = async () => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/discovery-units/`,
      { params: apiParams }
    );
    api.value = response?.data?.units;
    api.value?.forEach((_, idx) => {
      indices[idx] = {
        currentIndex: 0,
        slidePosition: 0,
      };
    });
    console.log(api.value);
  } catch (error) {
    console.error(error);
  } finally {
    mainLoader.value = false;
  }
};

const maxIndex = (length) => {
  return length / cardsPerPage + 2;
};

const moveLeft = (index) => {
  if (indices[index].currentIndex > 0) {
    indices[index].currentIndex -= 1;
    indices[index].slidePosition += cardsWidth * (cardsPerPage - 1) + 48;
  }
};

const moveRight = (index) => {
  if (indices[index].currentIndex < maxIndex(api.value[index].items.length)) {
    indices[index].currentIndex += 1;
    indices[index].slidePosition -= cardsWidth * (cardsPerPage - 1) + 48;
  }
};

const slideStyle = (position) => ({
  transform: `translateX(${position}px)`,
  transition: "transform 0.3s ease-in-out",
});

onMounted(() => {
  coursesApi();
  startTokenExpirationCheck();
});

onBeforeUnmount(() => {
  stopTokenExpirationCheck();
});
</script>

<style scoped>
.ant-skeleton {
  padding: 32px 24px;
}

.dashboard-main {
  padding: 24px;
  background-color: #fff;
  position: relative;
}

.heading {
  align-items: center;
  padding: 0px;
  margin: 0px 0px 16px;
  color: #2d2f31;
  font-size: 26px;
  display: flex;
  justify-content: flex-start;
}

.cards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.cards {
  display: flex;
  transition: transform 0.3s ease-in-out;
  margin: 0px;
}

.image-container {
  position: relative;
}

:deep(.ant-card-body) {
  padding: 10px 0px 0px;
}

.arrows {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  position: absolute;
  top: 40%;
}

.arrow-left {
  left: 20px;
}

.arrow-right {
  right: 20px;
}

:deep(.ant-btn.arrow-btn) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d2f31;
  width: 20px;
  height: 20px;
  padding: 0px;
}

.circle-icon {
  clip-path: circle(50% at 50% 50%);
  font-size: 50px;
  color: #fff;
  border-radius: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);
}

.active-arrow {
  color: #f6f7f9;
}
</style>
