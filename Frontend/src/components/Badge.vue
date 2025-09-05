<template>
  <div class="overlay">
    <!-- Premium Badge -->
    <div class="badge">
      <a-image
        src="/icons8-verification-64.png"
        alt="img"
        class="badge-verified-icon"
        :preview="false"
      />

      <span>Premium</span>
    </div>

    <!-- Badge Content -->
    <div class="badge-content">
      <span class="plan-text">
        Access this top-rated course, plus 12,000+ more top-rated courses, with
        a Udemy plan.

        <router-link to="#" class="plan-pricing">
          See Plans & Pricing
        </router-link>
      </span>

      <a-divider type="vertical" class="divider" />
    </div>

    <!-- Star Rating -->
    <StarRating
      class="star-rating"
      :starCount="5"
      :isPremiumBadge="true"
      :getCourseData="getCourseData"
    />

    <a-divider type="vertical" class="divider" />

    <!-- Learners Details -->
    <div class="learners-div">
      <UsergroupAddOutlined class="user-icon" />

      <p class="num-learners">{{ num_learners }}</p>

      <p class="learners-text">learners</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarRating from "./StarRating.vue";
import { UsergroupAddOutlined } from "@ant-design/icons-vue";

const { getCourseData } = defineProps({
  getCourseData: {
    type: Object,
    required: true,
  },
});

const num_learners = getCourseData.num_subscribers.toLocaleString();
</script>

<style scoped>
.overlay {
  display: flex;
  position: absolute;
  bottom: -65px;
  left: 70px;
  width: 700px;
  background-color: #fff;
  color: #303141;
  z-index: 90;
  margin-top: 20px;
  height: 100px;
  border-radius: 8px;
  border: 1px solid #d1d2e0;
  overflow: hidden;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #5022c3;
  padding: 0px 16px;
  width: 80px;
  gap: 8px;
}

:deep(.ant-image-img.badge-verified-icon) {
  width: 24px;
  height: 24px;
}

span {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0px;
}

.badge-content {
  display: inherit;
  width: 270px;
}

.plan-text {
  color: #303141 !important;
  font-size: 14px;
  font-weight: 400;
  margin: 18px;
  line-height: 1.4;
}

.plan-pricing {
  color: #6d28d2;
  font-weight: 700;
}

.divider {
  height: 60px;
  background-color: #d1d2e0;
  margin: 18px 0px;
}

.learners-div {
  display: flex;
  width: 110px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  margin: 16px;
  color: #303141;
}

.user-icon {
  font-size: 24px;
  color: #303141;
}

.num-learners {
  font-size: 14px;
  font-weight: 700;
  margin: 0px;
}

.learners-text {
  font-size: 14px;
  color: #595c73;
  margin: 0px;
}
</style>
