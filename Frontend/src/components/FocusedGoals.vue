<template>
  <div class="focused-goals">
    <a-skeleton-button
      v-if="loading"
      active
      block
      size="large"
      :style="{ width: '500px', margin: '5px 0px' }"
    />

    <div class="heading" v-else>
      {{ heading }}
    </div>

    <div class="content">
      <div class="left-panel">
        <a-list :grid="{ gutter: 8 }" :data-source="contents">
          <template #renderItem="{ item, index }">
            <a-card
              class="cards"
              @click="displayPicture(item.image.url, index)"
              @mouseover="onCardHover(index)"
              @mouseleave="onCardLeave"
              :bodyStyle="cardsStyle(index)"
            >
              <CaseStudyImage
                v-if="loading"
                :isCaseStudyPage="isCaseStudyPage"
              />

              <a-image
                class="goals-images"
                :src="item.secondaryImage.url"
                :height="64"
                :width="100"
                :preview="false"
                v-if="!loading"
              />

              <a-skeleton
                :loading="loading"
                active
                :paragraph="{ rows: 1 }"
                :style="{ margin: '0px 15px' }"
              />

              <div v-if="!loading" class="card-content">
                <h3>
                  {{ item.heading }}
                  <span class="label-text" v-if="item.labelText">
                    {{ item.labelText }}
                  </span>
                </h3>

                <p class="desc" v-html="item.description"></p>

                <a :href="item.contentUrl">
                  {{ item.contentUrlText }}
                  <ArrowRightOutlined
                    class="right-arrow-icon"
                    v-if="item.contentUrlText"
                  />
                </a>
              </div>
            </a-card>
          </template>
        </a-list>
      </div>

      <CaseStudyImage
        v-if="loading"
        :isCaseStudyPage="isCaseStudyPage"
        :isLogo="true"
      />

      <div class="right-panel" v-if="!loading">
        <a-image
          :src="imageUrl"
          alt="udemy image"
          :width="650"
          :height="710"
          :preview="false"
        />
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

const cardsStyle = (index) => {
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
.focused-goals {
  background-color: #f7f9fa;
  padding: 48px 24px;
  color: #2d2f31;
}

.heading {
  font-size: 27px;
}

.heading,
.label-text,
.card-content a {
  font-weight: 700;
}

.content {
  margin: 32px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2.4rem;
}

.content .left-panel {
  display: grid;
  row-gap: 1.2rem;
}

:deep(.left-panel .ant-row) {
  row-gap: 1.2rem;
  margin: 0px !important;
}

.left-panel .cards {
  width: 500px;
  border: 1px solid #d1d7dc;
}

.label-text {
  font-size: 10px;
  border: 1px solid #5022c3;
  padding: 3px 6px;
  border-radius: 4px;
  margin: 0px 0px 0px 10px;
}

.label-text,
.card-content a {
  color: #5022c3;
}

:deep(img.ant-image-img.goals-images) {
  position: absolute;
  top: 28px;
  left: 0px;
}

.card-content {
  padding: 0px 0px 0px 20px;
}

.card-content h3 {
  margin: 0px;
}

.card-content .desc {
  color: #6a6f73;
  font-size: 14px;
}

.anticon-arrow-right.right-arrow-icon {
  padding-left: 5px !important;
}

.cards:hover {
  cursor: pointer;
  background-color: #e4e8eb;
  border-radius: 4px;
}
</style>
