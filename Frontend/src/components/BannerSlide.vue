<template>
  <div v-if="isLogoutPage" class="logout-container">
    <CheckCircleFilled class="check-icon" />
    <h2 class="logout-text">
      You’ve successfully logged out of Udemy. Come back soon!
    </h2>
  </div>

  <a-row :gutter="16" v-if="loading">
    <a-col :span="12">
      <a-skeleton active :paragraph="{ rows: 6 }" />
    </a-col>
    <a-col :span="12">
      <ImageSkeleton />
    </a-col>
  </a-row>

  <!-- Carousel in Home and Logout page -->
  <div
    :class="
      isLogoutPage ? 'logout-carousel-container' : 'home-carousel-container'
    "
    v-if="!loading"
  >
    <a-carousel arrows :dots="false" autoplay :autoplay-speed="10000">
      <template #prevArrow>
        <div class="custom-slick-arrow prev-arrow">
          <LeftCircleFilled />
        </div>
      </template>

      <template #nextArrow>
        <div class="custom-slick-arrow next-arrow">
          <RightCircleFilled />
        </div>
      </template>

      <div class="carousel-item" v-for="{ data } in data" :key="data.title">
        <div
          :class="[
            'carousel-content',
            isLogoutPage ? 'logout-carousel-content' : 'home-carousel-content',
          ]"
        >
          <h1 v-if="!isLogoutPage" class="title">{{ data.title }}</h1>

          <h1 v-else>
            <a-image
              class="image"
              :src="data.title_url"
              :alt="data.title_url_alt_text"
              :preview="false"
            />
          </h1>

          <p
            :class="
              isLogoutPage
                ? 'logout-carousel-subtitle'
                : 'home-carousel-subtitle'
            "
          >
            {{ data.subtitle }}
          </p>

          <router-link to="#">
            <a-button
              :class="[
                'btn-common-style',
                isLogoutPage ? 'logout-banner-btn' : 'carousel-btn',
              ]"
              v-if="data.cta_1_text !== null && data.cta_1_text !== ''"
            >
              {{ data.cta_1_text }}
            </a-button>
          </router-link>
        </div>

        <a-image
          :class="[
            'carousel-image',
            isLogoutPage ? 'logout-page-carousel' : 'home-page-carousel',
          ]"
          :src="data.image"
          :preview="false"
          :width="'100%'"
        />
      </div>
    </a-carousel>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import {
  CheckCircleFilled,
  LeftCircleFilled,
  RightCircleFilled,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import axios from "axios";
import BannerSlideData from "@/jsonData/logoutBannerSlide.json";

const ImageSkeleton = defineAsyncComponent(() =>
  import("../skeletons/ImageSkeleton.vue")
);

const { isLogoutPage } = defineProps({
  isLogoutPage: {
    type: Boolean,
    required: true,
  },
});

const loading = ref(true);
const data = ref([]);

const fetchAPi = async () => {
  try {
    if (!isLogoutPage) {
      const response = await axios.get(
        "https://www.udemy.com/api-2.0/notices/me/",
        {
          params: {
            type: "banner_carousel_slide",
          },
        }
      );
      data.value = response.data.results;
    } else {
      data.value = BannerSlideData.results;
    }
  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  }
};

fetchAPi();
</script>

<style scoped>
.ant-skeleton {
  padding: 0px 24px;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 40px;
  height: 40px;
  font-size: 25px;
  background-color: #fff;
  border-radius: 50%;
  color: #2d2f31;
  transition: ease all 0.3s;
  z-index: 1;
  clip-path: circle(50% at 50% 50%);
}

:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #2d2f31;
  opacity: 0.9;
}

.prev-arrow {
  left: 20px;
  z-index: 2;
  font-size: 40px !important;
}

.next-arrow {
  right: 20px;
  font-size: 40px !important;
}

.logout-container {
  display: flex;
  gap: 20px;
  align-items: center;
  line-height: 1.2;
  padding: 16px;
  margin: 24px;
  border: 1px solid #2f2d31;
  border-radius: 15px;
}

.check-icon {
  font-size: 26px;
  color: #206241;
}

.logout-text {
  font-size: 18px;
  font-weight: 700;
  margin: 0px;
}

.logout-carousel-container {
  padding: 0px 24px;
}

.home-carousel-container {
  width: 100%;
}

.carousel-item {
  position: relative;
  display: flex;
}

.carousel-content {
  position: absolute;
  left: 53px;
  z-index: 1;
  transform: translateY(-50%);
  color: #2d2f31;
  line-height: 1.25;
}

.logout-carousel-content {
  top: 50%;
  background: none;
  padding: 0px;
  width: 300px;
  box-shadow: none;
  border-radius: 0;
}

.home-carousel-content {
  top: 32%;
  background: #fff;
  padding: 24px;
  width: 350px;
  box-shadow: 0 2px 4px rgba(6, 17, 118, 0.08),
    0 4px 12px rgba(6, 17, 118, 0.08);
  border-radius: 4px;
}

.title {
  font-size: 25px;
}

.carousel-content h1 {
  margin: 0px 0px 8px 0px;
}

:deep(.ant-image .ant-image-img.image) {
  width: 282px;
  height: 48px !important;
}

.logout-carousel-subtitle,
.home-carousel-subtitle {
  margin: 0px;
  font-weight: "400";
}

.logout-carousel-subtitle {
  font-size: 16px;
}

.home-carousel-subtitle {
  font-size: 14px;
}

.btn-common-style {
  background-color: #2d2f31;
  line-height: 1.2;
  padding: 10px;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
}

.carousel-btn,
.logout-banner-btn {
  color: #fff;
  height: 40px;
  margin-top: 1.6rem;
}

.carousel-btn {
  width: 100%;
}

.logout-banner-btn {
  width: 120px !important;
}

.carousel-btn:hover,
.logout-banner-btn:hover {
  color: #fff;
  border-color: #fff;
}
</style>
