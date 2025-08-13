<template>
  <a-skeleton :loading="mainLoader" active>
    <div
      class="main"
      v-for="({ title, items }, index) in combineCourseDetails"
      :key="index"
      :style="mainStyle"
    >
      <div class="heading" v-if="!isCoursesRender">
        <h2>{{ title }}</h2>
      </div>

      <div class="cards-container">
        <a-col :span="1" class="arrows" id="arrow-left">
          <a-button
            style="background-color: transparent"
            type="text"
            @click="moveLeft"
            v-show="currentIndex > 0"
          >
            <LeftCircleFilled :style="{ fontSize: '50px' }" />
          </a-button>
        </a-col>

        <a-row :gutter="gutterValue">
          <a-col :span="20">
            <div class="cards" :style="slideStyle">
              <CardsTooltipComponent
                v-for="(course, itemIndex) in items"
                :key="itemIndex"
                :itemIndex="itemIndex"
                :course="course"
                :index="index"
                :cardsWidth="cardsWidth"
                :loading="loading"
                :isLogoutPage="isLogoutPage"
                @click="redirectToCourse(course.id)"
              >
              </CardsTooltipComponent>
            </div>
          </a-col>
        </a-row>

        <a-col :span="1" class="arrows" id="arrow-right">
          <a-button
            style="background-color: transparent"
            type="text"
            @click="moveRight"
            v-show="currentIndex < maxIndex(items.length)"
          >
            <RightCircleFilled :style="{ fontSize: '50px' }" />
          </a-button>
        </a-col>
      </div>
    </div>
  </a-skeleton>
</template>

<script setup>
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons-vue";
import axios from "axios";
import { computed, ref, watch } from "vue";
import CardsTooltipComponent from "./CardsTooltipComponent.vue";
import { useRouter } from "vue-router";

const { isLogoutPage, isCoursesRender, categoryId } = defineProps({
  isLogoutPage: {
    type: Boolean,
    required: true,
  },
  isCoursesRender: {
    type: Boolean,
    required: false,
  },
  categoryId: {
    type: Number,
    required: false,
  },
});

const router = useRouter();
const mainLoader = ref(true);
const loading = ref(true);
const currentIndex = ref(0);
const cardsPerPage = isLogoutPage ? 5 : 4;
const cardsWidth = isLogoutPage ? 235 : 295;
const gutterValue = isLogoutPage ? 12 : 14;
const slidePosition = ref(0);
const api = ref([]);
const courseIds = ref([]);
const fields = ref([]);
const coursesData = ref([]);
const combineCourseDetails = ref([]);
const apiUrlParams =
  "context=personalized_home&from=0&page_size=6&item_count=50&source_page=logged_out_homepage&locale=en_US&currency=inr&navigation_locale=en&skip_price=true";
const coursesPriceData = ref([]);
fields.value = [
  "price",
  "discount_price",
  "list_price",
  "price_detail",
  "price_serve_tracking_id",
];

const coursesApi = async () => {
  try {
    if (isLogoutPage && isCoursesRender) {
      const response = await axios.get(
        `https://www.udemy.com/api-2.0/discovery-units/bestseller/`,
        {
          params: {
            Fapply_campaign_filter: false,
            category_id: categoryId,
            context: "logout",
            from: 0,
            page_size: 50,
            discovery_configuration_id: 514,
            fl: "cat",
            gl_tracking_id: "LAJKC-heTXyplb6mbtiHow",
            is_content_rankable: false,
            member_of: "skills_hub_categories",
            ref_tracking_id: "LAJKC-heTXyplb6mbtiHow",
            sos: "pc",
            ranking_index: 0,
            source_page: "logout_page",
          },
        }
      );
      api.value = response.data.unit;
    } else {
      const response = await axios.get(
        `https://www.udemy.com/api-2.0/discovery-units/?${apiUrlParams}`
      );
      api.value = response.data.units;
    }

    if (!Array.isArray(api.value)) {
      api.value = [api.value];
    }
    courseIds.value = api.value[0].items.map((course) => course.id);
    console.log(courseIds.value);

    await coursesDetailsApi();

    combineCourseDetails.value = combineCourse.value;
    console.log(combineCourse.value);
  } catch (error) {
    console.error(error);
  } finally {
    mainLoader.value = false;
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }
};

const coursesDetailsApi = async () => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/pricing/?course_ids=${courseIds.value
        .slice()
        .join(",")}&fields[pricing_result]=${fields.value}`
    );
    coursesPriceData.value = response.data;
    console.log(response.data);
    coursesData.value = api.value;
    console.log(coursesData.value);
  } catch (error) {
    console.error(error);
  }
};

const combineCourse = computed(() => {
  if (coursesPriceData.value && coursesData.value.length > 0) {
    return coursesData.value.map((courseGroup) => ({
      ...courseGroup,
      items: courseGroup.items.map((course) => {
        const pricing = coursesPriceData.value.courses[course.id];
        return {
          ...course,
          price: pricing ? pricing.price.price_string : "N/A",
          oldPrice: pricing ? pricing.list_price.price_string : "N/A",
        };
      }),
    }));
  } else {
    return [];
  }
});

const maxIndex = (length) => {
  return length / cardsPerPage - (isLogoutPage ? -2 : 1);
};

const moveLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    slidePosition.value +=
      cardsWidth * (isLogoutPage ? cardsPerPage - 1 : cardsPerPage) +
      (isLogoutPage ? 48 : 56);
  }
};

const moveRight = () => {
  if (currentIndex.value < maxIndex(api.value[0].items.length)) {
    currentIndex.value += 1;
    slidePosition.value -=
      cardsWidth * (isLogoutPage ? cardsPerPage - 1 : cardsPerPage) +
      (isLogoutPage ? 48 : 56);
  }
};

const slideStyle = computed(() => ({
  transform: `translateX(${slidePosition.value}px)`,
  transition: "transform 0.3s ease-in-out",
}));

document.documentElement.style.setProperty(
  "--dynamic-padding",
  isLogoutPage ? "10px 0px 0px" : "8px 24px 18px"
);

const mainStyle = {
  padding: isLogoutPage && categoryId ? "16px 24px 32px" : "32px 24px",
  backgroundColor: "#fff",
};

coursesApi();

watch(
  () => categoryId,
  (newValue) => {
    if (newValue) {
      coursesApi();
      loading.value = true;
      currentIndex.value = 0;
      slidePosition.value = 0;
    }
  }
);

const redirectToCourse = (id) => {
  const result = combineCourseDetails.value[0].items.filter((course) => {
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
</script>

<style scoped>
.ant-skeleton {
  padding: 32px 24px;
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

:deep(.ant-card-body) {
  padding: var(--dynamic-padding);
}

.arrows {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

#arrow-left {
  left: 0px;
  position: absolute;
}

#arrow-right {
  right: 0px;
  position: absolute;
}
</style>
