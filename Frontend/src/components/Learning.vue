<template>
  <a-skeleton :loading="loading" active :paragraph="{ rows: 2 }">
    <div class="main">
      <div class="learning">
        <div>
          <div class="heading">
            <h1>{{ learningData.data.dynamicWebContent.heading }}</h1>
          </div>
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

          <a-row :gutter="14">
            <a-col :span="15">
              <div class="cards" :style="slideStyle">
                <a-col class="card1" :span="8">
                  <a-card
                    :style="{
                      border: '1px solid #d1d7dc',
                      width: `${cardsWidth}px`,
                    }"
                  >
                    <img id="quotes" :src="quoteImage" />
                    <div id="content" v-html="cardsData[0].description"></div>

                    <img
                      :src="cardsData[0].contents[0].image.url"
                      alt="review-img"
                    />

                    <span
                      id="details"
                      v-html="cardsData[0].contents[0].description"
                    ></span>
                    <div id="link">
                      <router-link to="#">
                        <span
                          id="nav"
                          v-html="cardsData[0].contentUrlText"
                        ></span>

                        <RightOutlined
                          :style="{
                            margin: '0px 0px 0px 4px',
                            fontSize: '10px',
                          }"
                        />
                      </router-link>
                    </div>
                  </a-card>
                </a-col>

                <a-col
                  class="card2"
                  :span="8"
                  v-for="card in cardsData.slice(1)"
                  :key="card"
                >
                  <a-card
                    :style="{
                      border: '1px solid #d1d7dc',
                      width: `${cardsWidth}px`,
                    }"
                  >
                    <img id="quotes" :src="quoteImage" />
                    <p id="content" v-html="card.description"></p>

                    <div id="reviewers">
                      <img :src="card.contents[0].image.url" />
                      <div id="details">
                        <span>{{ card.contents[0].heading }}</span
                        ><br />
                        <span v-html="card.contents[0].description"></span>
                      </div>
                    </div>

                    <div id="link">
                      <router-link to="#">
                        <span id="nav" v-html="card.contentUrlText"></span>
                        <RightOutlined
                          :style="{
                            margin: '0px 0px 0px 4px',
                            fontSize: '10px',
                          }"
                        />
                      </router-link>
                    </div>
                  </a-card>
                </a-col>
              </div>
            </a-col>
          </a-row>

          <a-col :span="1" class="arrows" id="arrow-right">
            <a-button
              style="background-color: transparent"
              type="text"
              @click="moveRight"
              v-show="currentIndex < maxIndex"
            >
              <RightCircleFilled :style="{ fontSize: '50px' }" />
            </a-button>
          </a-col>
        </div>
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
const quoteImage = ref(
  "https://s.udemycdn.com/browse_components/student-quote-unit/quote.svg"
);
const cardsData = learningData.data.dynamicWebContent.contents;
const cardsWidth = 310;

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

setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.ant-skeleton {
  padding: 0px 24px;
}

.learning {
  padding: 32px 24px;
  background-color: #f7f9fa;
}

.heading h1 {
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

.cards {
  display: flex;
  transition: transform 0.3s ease-in-out;
}

.cards #quotes {
  width: 20px;
}

#content {
  margin: 14px 0px 0px;
}

.cards .card1,
.card2 {
  display: flex;
  max-width: 100%;
}

#lnk,
:deep(#content a) {
  color: #5022c3;
}

:deep(#details p) {
  margin: 0px;
  color: #6a6f73;
}

:deep(#link p) {
  margin: 24px 0px 0px;
}

#link a {
  color: #5022c3;
}

#link:hover a,
#lnk:hover {
  cursor: pointer;
  color: #371783;
}

#nav {
  display: inline-block;
}

#reviewers {
  margin: 30px 0px 0px;
  display: flex;
  align-items: center;
}

#reviewers img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

#reviewers #details {
  font-size: 12px;
  color: #6a6f73;
  padding: 0px 0px 0px 6px;
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
