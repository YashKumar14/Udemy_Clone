<template>
  <a-skeleton :loading="mainLoader" :active="true">
    <div class="main" v-for="({ title, items }, index) in api" :key="index">
      <div class="heading">
        <h2>{{ title }}</h2>
      </div>

      <div class="cards-container">
        <a-col :span="1" class="arrows" id="arrow-left">
          <a-button
            class="btn"
            type="text"
            @click="moveLeft(index)"
            v-show="indices[index].currentIndex > 0"
          >
            <LeftCircleFilled
              :style="arrowStyles(index, 'left')"
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
                :loading="loading"
                :isLogoutPage="false"
                @click="redirectToCourse(course.id)"
              >
              </CardsTooltipComponent>
            </div>
          </a-col>
        </a-row>

        <a-col :span="1" class="arrows" id="arrow-right">
          <a-button
            class="btn"
            type="text"
            @click="moveRight(index)"
            v-show="indices[index].currentIndex < maxIndex(items.length)"
          >
            <RightCircleFilled
              :style="arrowStyles(index, 'right')"
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
import CardsTooltipComponent from "./CardsTooltipComponent.vue";
import { useToken } from "@/utils/useToken.js";
import { useRouter } from "vue-router";

const { startTokenExpirationCheck, stopTokenExpirationCheck } = useToken();

const router = useRouter();
const mainLoader = ref(true);
const loading = ref(true);
const cardsPerPage = 5;
const cardsWidth = 235;
const api = ref([]);
const indices = reactive({});
const apiUrlParams =
  "context=subs_featured&from=0&page_size=13&item_count=60&source_page=logged_in_homepage&locale=en_US&currency=inr&navigation_locale=en_US&skip_price=true";
const isArrowHovered = reactive({});

const coursesApi = async () => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/discovery-units/?${apiUrlParams}`
    );
    api.value = response.data.units;
    api.value.forEach((_, idx) => {
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
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }
};

const redirectToCourse = (id) => {
  const result = api.value[0].items.filter((course) => {
    if (course.id === id) {
      const instructorId = course.visible_instructors[0].id;
      console.log(course.visible_instructors);

      localStorage.setItem("setSelectedCourseId", id);
      localStorage.setItem("setSelectedCourseInstructorId", instructorId);
      localStorage.setItem("setSelectedCourseTitle", course.title);

      document.title = course.title;
      router.push(course.learn_url.split("/learn/").join(""));
    }
  });

  console.log(result);
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

const arrowStyles = (index, side) => ({
  fontSize: "50px",
  color: isArrowHovered[`${index}-${side}`] ? "#f6f7f9" : "#fff",
  borderRadius: "100%",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08)",
});

onMounted(() => {
  startTokenExpirationCheck();
});

onBeforeUnmount(() => {
  stopTokenExpirationCheck();
});
coursesApi();
</script>

<style scoped>
.ant-skeleton {
  padding: 32px 24px;
}

.main {
  padding: 24px;
  background-color: #fff;
  position: relative;
}

.heading h2 {
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
}

:deep(.arrows .btn) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d2f31;
  width: 20px;
  height: 20px;
}

#arrow-left {
  position: absolute;
  left: 20px;
  top: 40%;
}

#arrow-right {
  position: absolute;
  right: 20px;
  top: 40%;
}
</style>
