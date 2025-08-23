<template>
  <a-skeleton :loading="loading" active :paragraph="{ rows: 2 }">
    <div class="learning-reviews">
      <h1 class="heading">
        {{ learningData.data.dynamicWebContent.heading }}
      </h1>

      <div class="cards-container">
        <a-col :span="1" class="arrows arrow-left">
          <a-button
            class="arrow-btn left-arrow-btn"
            type="text"
            @click="moveLeft"
            v-show="currentIndex > 0"
          >
            <LeftCircleFilled class="circle-icon left-circle-icon" />
          </a-button>
        </a-col>

        <a-list :grid="{ gutter: 16 }" :data-source="cardsData">
          <template #renderItem="{ item }">
            <a-list-item class="cards" :style="slideStyle">
              <a-card :style="cardsStyle">
                <a-image
                  class="quotes"
                  src="/quote.svg"
                  :width="20"
                  :preview="false"
                />

                <p class="content" v-html="item.description"></p>

                <div
                  v-if="item.labelText === 'THIRD_PARTY'"
                  class="label-third-party"
                >
                  <a-image
                    :src="cardsData[0].contents[0].image.url"
                    alt="review-img"
                    :preview="false"
                  />

                  <span
                    class="details"
                    v-html="cardsData[0].contents[0].description"
                  ></span>
                </div>

                <div class="reviewers" v-else>
                  <a-image
                    class="reviewers-img"
                    :src="item.contents[0].image.url"
                    :preview="false"
                  />

                  <div class="details">
                    <span>{{ item.contents[0].heading }}</span>
                    <!-- <br /> -->
                    <span v-html="item.contents[0].description"></span>
                  </div>
                </div>

                <div class="link">
                  <router-link to="#">
                    <span class="nav" v-html="item.contentUrlText"></span>
                    <RightOutlined class="right-icon" />
                  </router-link>
                </div>
              </a-card>
            </a-list-item>
          </template>
        </a-list>

        <a-col :span="1" class="arrows arrow-right">
          <a-button
            class="arrow-btn right-arrow-btn"
            type="text"
            @click="moveRight"
            v-show="currentIndex < maxIndex"
          >
            <RightCircleFilled class="circle-icon right-circle-icon" />
          </a-button>
        </a-col>
      </div>
    </div>
  </a-skeleton>
</template>

<script setup>
import {
  RightOutlined,
  LeftCircleFilled,
  RightCircleFilled,
} from "@ant-design/icons-vue";
import { computed, ref } from "vue";
import learningData from "@/jsonData/learning.json";

const loading = ref(true);
const currentIndex = ref(0);
const maxIndex = 1;
const slidePosition = ref(0);
const cardsData = learningData.data.dynamicWebContent.contents;
const cardsWidth = 325;

const moveLeft = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
    slidePosition.value += 55;
  }
};

const moveRight = () => {
  if (currentIndex.value < maxIndex) {
    currentIndex.value += 1;
    slidePosition.value -= 55;
  }
};

const slideStyle = computed(() => ({
  transform: `translateX(${slidePosition.value}px)`,
  transition: "transform 0.3s ease-in-out",
}));

const cardsStyle = {
  border: "1px solid #d1d7dc",
  width: `${cardsWidth}px`,
};

setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.ant-skeleton {
  padding: 0px 24px;
}

.learning-reviews {
  padding: 32px 24px;
  background-color: #f7f9fa;
}

.heading {
  align-items: center;
  padding: 0px;
  margin: 0px;
  color: #2d2f31;
  margin-bottom: 2.4rem;
  font-size: 35px;
}

.cards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

:deep(.cards .ant-card) {
  min-height: 350px;
}

:deep(.ant-list .ant-list-item.cards) {
  padding: 0px;
}

:deep(.ant-list .ant-row) {
  flex-flow: unset;
  margin-left: 50px !important;
}

.content {
  margin-top: 14px;
  min-height: 90px;
}

:deep(.content a),
.link a {
  color: #5022c3;
}

:deep(.details p) {
  margin: 0px;
  color: #6a6f73;
}

:deep(.link) {
  margin-top: 24px;
}

.link a:hover {
  cursor: pointer;
  color: #371783;
}

.nav {
  display: inline-block;
}

.label-third-party {
  margin-top: 30px;
}

.reviewers {
  margin-top: 30px;
  display: flex;
  align-items: center;
}

:deep(.ant-image .reviewers-img.ant-image-img) {
  width: 48px !important;
  height: 48px !important;
  border-radius: 50%;
}

.reviewers .details {
  font-size: 12px;
  color: #6a6f73;
  padding-left: 6px;
}

.right-icon {
  margin-left: 4px;
  font-size: 10px;
}

.arrows {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.arrow-left {
  left: 0px;
  position: absolute;
  margin-left: 2px;
}

.arrow-right {
  right: 0px;
  position: absolute;
  margin-right: 2px;
}

:deep(.ant-btn.arrow-btn) {
  background-color: transparent;
  width: 52px;
  height: 52px;
  padding: 0px;
  clip-path: circle(50% at 50% 50%);
}

.circle-icon {
  font-size: 50px;
}
</style>
