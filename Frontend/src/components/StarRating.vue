<template>
  <h4 :class="isPremiumBadge ? 'badge-rating' : 'rating'" v-if="courseData">
    <span id="rate">
      {{ Math.round(courseData.rating * 10) / 10 }}
    </span>

    <a-rate
      class="star-rating"
      :value="courseData.rating"
      :count="starCount"
      allow-half
      disabled
    />
    <a href="#" id="num-review" v-if="!isPremiumBadge">
      ({{ courseData.num_reviews.toLocaleString() }} ratings)
    </a>
    <a href="#" id="num-review" v-else>
      {{ courseData.num_reviews.toLocaleString() }} ratings
    </a>

    <span id="num-subscribers" v-if="!isPremiumBadge">
      {{ courseData.num_subscribers.toLocaleString() }} students
    </span>
  </h4>
</template>

<script setup>
import { ref } from "vue";

const { starCount, isPremiumBadge, getCourseData } = defineProps({
  starCount: {
    type: Number,
    required: true,
  },
  isPremiumBadge: {
    type: Boolean,
    required: false,
  },
  getCourseData: {
    type: Object,
    required: true,
  },
});

console.log("getcourseData:::", getCourseData);

const courseData = ref({});
courseData.value = getCourseData;
</script>

<style scoped>
.rating {
  font-size: 14px;
  font-weight: 700;
  margin: 0px;
}

#rate,
.star-rating {
  color: #f69c08;
}

.star-rating {
  font-size: medium;
  transform: scale(0.8);
}

:deep(.star-rating .ant-rate-star-second) {
  color: #d1d2e0;
}

:deep(.ant-rate-star-full .ant-rate-star-second) {
  color: #f69c08 !important;
}

#num-subscribers {
  margin-left: 5px;
}

#num-subscribers {
  font-size: 14px;
  font-weight: 400;
}

a {
  color: #c0c4fc;
  font-size: 14px;
  font-weight: 400;
}

.badge-rating {
  display: flex;
  width: 170px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 10px 0px;
}

.badge-rating #rate {
  font-size: 24px;
  color: #303141;
  font-weight: 700;
}

.badge-rating .star-rating {
  font-size: 18px;
}

.badge-rating #num-review {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  color: #595c73;
  margin: 6px 0px 0px;
  text-underline-offset: 2px;
}
</style>
