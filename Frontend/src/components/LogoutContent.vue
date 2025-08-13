<template>
  <a-skeleton-button v-if="mainLoader" active block :style="mainStyle" />
  <div class="course_categories" v-else>
    <ul>
      <li
        v-for="({ title }, index) in coursesCategories.categories"
        :key="title"
        @click="selectCategory(title, index)"
        :class="{ 'active-category': selectedCategory === title }"
      >
        {{ title }}
      </li>
    </ul>
  </div>
  <CoursesCards
    v-if="coursesCategories.categories.length > 0"
    :isLogoutPage="true"
    :isCoursesRender="true"
    :categoryId="selectedCategoryId"
  />
</template>

<script setup>
import { ref } from "vue";
import CoursesCards from "./CoursesCards.vue";

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

const { title, id } = coursesCategories.categories[0];
const selectedCategory = ref(title);
const selectedCategoryId = ref(id);

console.log(selectedCategoryId.value);

const selectCategory = (title, index) => {
  selectedCategory.value = title;
  if (coursesCategories.categories.length > 0) {
    selectedCategoryId.value = coursesCategories.categories[index].id;
    console.log(selectedCategoryId.value);
  } else {
    console.log("::: selectedCategoryId");
  }
};

const mainStyle = {
  padding: "18px 24px",
};

setTimeout(() => {
  mainLoader.value = false;
}, 5000);
</script>

<style scoped>
.course_categories {
  margin: 10px 0px 0px;
  text-align: center;
  padding: 0px 24px;
}

.course_categories ul {
  border-bottom: 1px solid #e9eaf2;
  display: grid;
  grid-auto-columns: max-content;
  grid-auto-flow: column;
  grid-gap: 16px;
  overflow: hidden;
  list-style: none;
  margin: 0px;
  padding: 0px;
}

.course_categories li {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: #595c73;
  padding: 12px 4px;
}

.course_categories li:hover {
  cursor: pointer;
}

.active-category {
  border-bottom: 3.2px solid #2f2d31;
}

.course_categories .active-category {
  color: #2f2d31;
}
</style>
