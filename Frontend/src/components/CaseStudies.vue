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
        <div class="case-studies">
          <div class="left-content">
            <div class="image">
              <a-skeleton-button
                v-if="loading"
                active
                block
                :style="{ margin: '5px 0px', width: '30%' }"
              />

              <a-image
                v-else
                class="logo"
                :src="study.secondaryImage.url"
                :alt="study.secondaryImage.altText"
                :preview="false"
              />
            </div>

            <a-skeleton v-if="loading" active :paragraph="{ rows: 1 }" />
            <div class="heading" v-else>
              {{ study.heading }}
            </div>

            <div class="contents">
              <div class="content" v-for="data in study.contents" :key="data">
                <a-skeleton-button
                  v-if="loading"
                  active
                  size="large"
                  block
                  :style="{ width: '100px', margin: '5px 0px' }"
                />

                <div class="content-heading" v-else>
                  {{ data.heading }}
                </div>

                <a-skeleton :loading="loading" active :paragraph="{ rows: 1 }">
                  <div class="content-desc">
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

            <a-button
              class="story-btn"
              :href="study.contentUrl"
              target="_blank"
              v-else
            >
              {{ study.contentUrlText }}
              <ArrowRightOutlined class="arrow-icon" />
            </a-button>
          </div>

          <CaseStudyImage v-if="loading" :isCaseStudyPage="isCaseStudyPage" />

          <div class="right-content" v-else>
            <a-image
              class="side-image"
              :src="study.image.url"
              :alt="study.image.altText"
              :preview="false"
              :width="610"
              :height="500"
            />
          </div>
        </div>
      </template>
    </template>

    <template #prevArrow>
      <a-button
        v-if="!loading"
        type="text"
        :class="[
          'custom-slick-arrow',
          'custom-slick-left-arrow',
          { disabled: isLeftArrowDisabled },
        ]"
        @click="handlePrevClick"
      >
        <LeftCircleFilled />
      </a-button>
    </template>

    <template #nextArrow>
      <a-button
        v-if="!loading"
        type="text"
        :class="[
          'custom-slick-arrow',
          'custom-slick-right-arrow',
          { disabled: isRightArrowDisabled },
        ]"
        @click="handleNextClick"
      >
        <RightCircleFilled />
      </a-button>
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
  font-size: 38px;
  color: #fff;
  background-color: #2d2f31;
  transition: ease all 0.3s;
  opacity: 0.8;
  z-index: 1;
  border: 1px solid #2d2f31;
  border-radius: 50%;
  margin-top: 25px;
  clip-path: circle(50% at 50% 50%);
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

.custom-slick-left-arrow {
  left: 24px;
  top: 445px;
}

.custom-slick-right-arrow {
  left: 189px;
  top: 445px;
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

.case-studies {
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

.heading {
  font-size: 28px;
  font-weight: 700;
  margin: 16px 0;
  line-height: 1.2;
  max-width: 500px;
}

.contents {
  display: flex;
  gap: 16px;
}

.content-heading {
  font-size: 33px;
  font-weight: 700;
  line-height: 1.2;
}

.content-desc {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  width: 230px;
  padding: 0px 0px 16px;
  border-bottom: 1px solid #d1d7dc;
}

.story-btn {
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

.story-btn:hover {
  box-shadow: none;
  border: 1px solid;
  color: #fff;
}

.right-content {
  display: flex;
  width: 50%;
  object-fit: cover;
  aspect-ratio: 1;
  height: 500px;
  margin: 0px 0px 5px;
}
</style>
