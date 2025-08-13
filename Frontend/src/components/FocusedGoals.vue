<template>
  <div class="main">
    <a-skeleton-button
      v-if="loading"
      active
      block
      size="large"
      :style="{ width: '500px', margin: '5px 0px' }"
    />

    <div id="heading" v-else>
      {{ heading }}
    </div>

    <div class="content">
      <div id="left-panel">
        <template v-for="(details, index) in contents" :key="index">
          <a-card
            id="cards"
            @click="displayPicture(details.image.url, index)"
            @mouseover="onCardHover(index)"
            @mouseleave="onCardLeave"
            :bodyStyle="applyStyle(index)"
          >
            <CaseStudyImage v-if="loading" :isCaseStudyPage="isCaseStudyPage" />
            <img
              :src="details.secondaryImage.url"
              height="64"
              width="64"
              v-else
            />

            <a-skeleton
              :loading="loading"
              active
              :paragraph="{ rows: 1 }"
              :style="{ margin: '0px 15px' }"
            />

            <div v-if="!loading">
              <h3>
                {{ details.heading }}
                <span id="labelText" v-if="details.labelText">
                  {{ details.labelText }}
                </span>
              </h3>
              <p id="desc" v-html="details.description"></p>
              <a :href="details.contentUrl">
                {{ details.contentUrlText }}
                <ArrowRightOutlined
                  v-if="details.contentUrlText"
                  style="padding-left: 5px"
                />
              </a>
            </div>
          </a-card>
        </template>
      </div>

      <CaseStudyImage
        v-if="loading"
        :isCaseStudyPage="isCaseStudyPage"
        :isLogo="true"
      />
      <div id=" right-panel" v-if="!loading">
        <img :src="imageUrl" alt="udemy image" width="100%" height="710px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import learningData from "@/jsonData/focusedGoals.json";
import { ArrowRightOutlined } from "@ant-design/icons-vue";
import CaseStudyImage from "@/skeletons/CaseStudyImage.vue";

const {
  data: {
    dynamicWebContent: { heading, contents },
  },
} = learningData;
const isCaseStudyPage = ref(false);
const loading = ref(true);
const imageUrl = ref(contents[0].image.url);
const selectedCardIndex = ref(0);
const hoveredIndex = ref(null);

const displayPicture = (url, index) => {
  imageUrl.value = url;
  selectedCardIndex.value = index;
};

const wrapStyle = {
  display: "flex",
  borderColor: "#a435f0",
  backgroundColor: "#f7f9fa",
  borderWidth: "1px 1px 1px 12.8px",
  borderStyle: "solid",
  borderRadius: "6px",
};

const applyStyle = (index) => {
  if (
    index === selectedCardIndex.value &&
    hoveredIndex.value !== selectedCardIndex.value
  ) {
    return wrapStyle;
  }
  return { display: "flex" };
};

const onCardHover = (index) => {
  hoveredIndex.value = index;
};

const onCardLeave = () => {
  hoveredIndex.value = null;
};

setTimeout(() => {
  loading.value = false;
}, 2000);
</script>

<style scoped>
.main {
  background-color: #f7f9fa;
  padding: 48px 24px;
  color: #2d2f31;
}

#heading {
  font-size: 27px;
  font-weight: 700;
}

.content {
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.4rem;
}

.content #left-panel {
  display: grid;
  row-gap: 1.2rem;
}

#left-panel #cards {
  width: 500px;
  border: 1px solid #d1d7dc;
}

#labelText {
  font-size: 10px;
  font-weight: 700;
  color: #5022c3;
  border: 1px solid #5022c3;
  padding: 3px 6px;
  border-radius: 4px;
  margin-left: 10px;
  background-color: #f7f9fa;
}

#cards img {
  padding: 30px 20px 0px 0px;
}

#cards h3 {
  margin: 0px;
}

#cards #desc {
  color: #6a6f73;
  font-size: 14px;
  font-weight: 400;
}

#cards a {
  color: #5022c3;
  font-weight: 800;
}

#cards :hover {
  cursor: pointer;
  background-color: #e4e8eb;
  border-radius: 4px;
}
</style>
