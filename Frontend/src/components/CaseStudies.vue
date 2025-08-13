<template>
  <a-carousel
    arrows
    :dotPosition="'bottom'"
    :dots="!loading"
    v-model:currentIndex="currentIndex"
    :before-change="handleBeforeChange"
  >
    <template v-for="study in contents" :key="study">
      <template>
        <div class="main">
          <div class="left-content">
            <div id="image">
              <a-skeleton-button
                v-if="loading"
                active
                block
                :style="{ margin: '5px 0px', width: '30%' }"
              />
              <img
                id="logo"
                :src="study.secondaryImage.url"
                :alt="study.secondaryImage.altText"
                v-else
              />
            </div>

            <a-skeleton v-if="loading" active :paragraph="{ rows: 1 }" />
            <div id="heading" v-else>
              {{ study.heading }}
            </div>

            <div id="contents">
              <div id="content" v-for="data in study.contents" :key="data">
                <a-skeleton-button
                  v-if="loading"
                  active
                  size="large"
                  block
                  :style="{ width: '100px', margin: '5px 0px' }"
                />
                <div id="content-heading" v-else>
                  {{ data.heading }}
                </div>
                <a-skeleton :loading="loading" active :paragraph="{ rows: 1 }">
                  <div id="content-desc">
                    {{ data.description }}
                  </div>
                </a-skeleton>
              </div>
            </div>

            <a-skeleton-button
              v-if="loading"
              active
              size="large"
              block
              :style="{ width: '150px', margin: '20px 0px 0px' }"
            />
            <a-button id="btn" :href="study.contentUrl" target="_blank" v-else>
              {{ study.contentUrlText }}
              <ArrowRightOutlined id="icon" />
            </a-button>
          </div>

          <CaseStudyImage v-if="loading" :isCaseStudyPage="isCaseStudyPage" />
          <div class="right-content" v-else>
            <img :src="study.image.url" :alt="study.image.altText" />
          </div>
        </div>
      </template>
    </template>

    <template #prevArrow>
      <div
        v-if="!loading"
        class="custom-slick-arrow"
        style="left: 24px; top: 445px"
        :class="{ disabled: isLeftArrowDisabled }"
        @click="handlePrevClick"
      >
        <LeftCircleFilled />
      </div>
    </template>

    <template #nextArrow>
      <div
        v-if="!loading"
        class="custom-slick-arrow"
        style="left: 189px; top: 445px"
        :class="{ disabled: isRightArrowDisabled }"
        @click="handleNextClick"
      >
        <RightCircleFilled />
      </div>
    </template>
  </a-carousel>
</template>

<script setup>
import {
  LeftCircleFilled,
  RightCircleFilled,
  ArrowRightOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import caseStudyData from "@/jsonData/caseStudy.json";
import CaseStudyImage from "@/skeletons/CaseStudyImage.vue";

const isCaseStudyPage = ref(true);
const loading = ref(true);
const currentIndex = ref(0);
const isLeftArrowDisabled = ref(true);
const isRightArrowDisabled = ref(false);
const {
  data: {
    dynamicWebContent: { contents },
  },
} = caseStudyData;

const handleBeforeChange = (current, next) => {
  const totalSlides = contents.length;

  isLeftArrowDisabled.value = next === 0;
  isRightArrowDisabled.value = next === totalSlides - 1;
};

const handlePrevClick = (event) => {
  if (isLeftArrowDisabled.value) {
    event.stopImmediatePropagation();
  } else {
    currentIndex.value -= 1;
  }
};

const handleNextClick = (event) => {
  if (isRightArrowDisabled.value) {
    event.stopImmediatePropagation();
  } else {
    currentIndex.value += 1;
  }
};

setTimeout(() => {
  loading.value = false;
}, 2000);
</script>

<style scoped>
:deep(.slick-slide) {
  color: #2d2f31;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 40px;
  height: 40px;
  font-size: 40px;
  color: #fff;
  background-color: #2d2f31;
  transition: ease all 0.3s;
  opacity: 0.8;
  z-index: 1;
  border: 1px solid #2d2f31;
  border-radius: 50%;
  margin-top: 25px;
}

:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}

:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: gray;
  opacity: 0.5;
}

:deep(.slick-arrow.custom-slick-arrow.disabled) {
  opacity: 0.1;
  cursor: not-allowed;
}

:deep(.slick-dots) {
  left: 70px;
  right: auto;
  bottom: 25px;
  text-align: left;
  padding-left: 5px;
}

:deep(.slick-dots li button) {
  background-color: #d1d7dc;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  pointer-events: none;
}

:deep(.slick-dots li.slick-active button) {
  background-color: #a435f0;
  border-radius: 25px;
  width: 23px;
  height: 8px;
}

.main {
  display: flex;
  height: max-content;
  background-color: #f7f9fa;
  padding: 24px 24px 0px;
}

.left-content {
  display: flex;
  flex-direction: column;
  padding: 48px 16px 0px 0px;
  width: 50%;
}

#logo {
  height: 32px;
  width: auto;
  margin-bottom: 16px;
}

#heading {
  font-size: 28px;
  font-weight: 700;
  margin: 16px 0;
  line-height: 1.2;
  max-width: 500px;
}

#contents {
  display: flex;
  gap: 16px;
}

#content-heading {
  font-size: 33px;
  font-weight: 700;
  line-height: 1.2;
}

#content-desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  width: 230px;
  padding: 0px 0px 16px;
  border-bottom: 1px solid #d1d7dc;
}

#btn {
  display: inline-flex;
  align-items: center;
  margin: 16px 0px 0px;
  padding: 12px 12px;
  background-color: #1c1d1f;
  color: #fff;
  width: fit-content;
  height: 48px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

#btn:hover {
  box-shadow: none;
  border: 1px solid;
}

.right-content {
  display: flex;
  width: 50%;
  object-fit: cover;
  aspect-ratio: 1;
  height: 500px;
  margin: 0px 0px 5px;
}

img {
  width: 100%;
}
</style>
