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

  <div class="carousel-container" v-if="!loading" :style="mainContainerStyle">
    <a-carousel arrows :dots="false" autoplay :autoplay-speed="10000">
      <template #prevArrow>
        <div
          class="custom-slick-arrow"
          style="left: 20px; z-index: 2; font-size: 40px"
        >
          <LeftCircleFilled />
        </div>
      </template>

      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 20px; font-size: 40px">
          <RightCircleFilled />
        </div>
      </template>

      <div class="carousel-item" v-for="{ data } in data" :key="data.title">
        <div class="carousel-content" :style="carouselContentStyle">
          <h1 v-if="!isLogoutPage" id="title">{{ data.title }}</h1>
          <h1 v-else>
            <img
              id="image"
              :src="data.title_url"
              :alt="data.title_url_alt_text"
            />
          </h1>
          <p :style="subtitleStyle">{{ data.subtitle }}</p>
          <div
            id="link"
            v-if="data.cta_1_text !== null && data.cta_1_text !== ''"
            :style="btnStyle"
          >
            <router-link to="#">
              <span>{{ data.cta_1_text }}</span>
            </router-link>
          </div>
        </div>
        <a-image class="carousel-image" :src="data.image" :preview="false" />
      </div>
    </a-carousel>
  </div>
</template>

<script setup>
import {
  CheckCircleFilled,
  LeftCircleFilled,
  RightCircleFilled,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import ImageSkeleton from "../skeletons/ImageSkeleton.vue";
import axios from "axios";
import BannerSlideData from "@/jsonData/logoutBannerSlide.json";

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
        "https://www.udemy.com/api-2.0/notices/me/?type=banner_carousel_slide"
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

const mainContainerStyle = isLogoutPage
  ? {
      padding: "0px 24px",
    }
  : { width: "100%" };

const baseStyle = {
  position: "absolute",
  left: "53px",
  zIndex: 1,
  transform: "translateY(-50%)",
  color: "#2d2f31",
  lineHeight: "1.25",
};

const carouselContentStyle = {
  ...baseStyle,
  top: isLogoutPage ? "50%" : "32%",
  background: isLogoutPage ? "none" : "#fff",
  padding: isLogoutPage ? "none" : "24px",
  width: isLogoutPage ? "300px" : "350px",
  boxShadow: isLogoutPage
    ? "none"
    : "0 2px 4px rgba(6, 17, 118, .08), 0 4px 12px rgba(6, 17, 118, .08)",
  borderRadius: isLogoutPage ? "none" : "4px",
};

const subtitleStyle = {
  fontSize: isLogoutPage ? "16px" : "14px",
  fontWeight: "400",
};
const btnStyle = {
  backgroundColor: "#2d2f31",
  lineHeight: "1.2",
  padding: "10px",
  fontWeight: 700,
  fontSize: "16px",
  textAlign: "center",
  width: isLogoutPage ? "100px" : "",
  borderRadius: "5px",
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
}

:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #2d2f31;
  opacity: 0.9;
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

.carousel-item {
  position: relative;
  display: flex;
}

#title {
  font-size: 25px;
}

.carousel-content h1 {
  margin: 0 0 8px 0;
}

#image {
  width: 282px;
  height: 48px;
}

.carousel-content p {
  margin: 0px;
}

.carousel-content div {
  margin-top: 1.6rem;
}

.carousel-image {
  width: 100%;
  height: 400px;
}

#link span {
  color: #fff;
}
</style>
