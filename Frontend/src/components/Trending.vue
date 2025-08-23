<template>
  <div class="trend">
    <h1 class="heading">Trending Now</h1>

    <div class="content">
      <div class="col-one">
        <BlankSkeleton v-if="loading" />

        <div v-else>
          <h2>ChatGPT is a top skill</h2>

          <router-link class="chat" to="#">
            <a-button type="link">See ChatGPT courses</a-button>

            <RightOutlined class="right-icon" />
          </router-link>

          <span class="learners">3,788,431 learners</span>
        </div>

        <a-button type="primary" class="btn" @click="showTrendingSkills">
          Show all trending skills

          <RiseOutlined class="rise-icon" />
        </a-button>
      </div>

      <div class="col-two">
        <a-list
          :grid="{ gutter: 8, column: 3 }"
          :data-source="topics"
          class="courses-list"
        >
          <template #renderItem="{ item, index }">
            <a-list-item :key="item" class="course-title">
              <a-skeleton-button
                class="course-titles-skeleton"
                v-if="loading"
                active
                block
                size="large"
              />

              <span class="col-title" v-else>
                {{ Object.keys(item).join(" ") }}
              </span>

              <a-skeleton
                class="courses-skeleton"
                :loading="loading"
                active
                :paragraph="{ rows: 2 }"
              />

              <a-list
                :grid="{ gutter: 16 }"
                :data-source="Object.values(item)[0]"
              >
                <template #renderItem="{ item }">
                  <a-list-item
                    :key="item"
                    class="course-list-item"
                    v-if="!loading"
                  >
                    <router-link class="topic" to="#">
                      <span>{{ item.course }}</span>

                      <RightOutlined class="right-icon" />
                    </router-link>
                    <span class="learners">{{ item.learners }}</span>
                  </a-list-item>
                </template>
              </a-list>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import BlankSkeleton from "@/skeletons/BlankSkeleton.vue";
import { RightOutlined, RiseOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const loading = ref(true);
const topics = ref([]);
const router = useRouter();

topics.value = [
  {
    Development: [
      {
        course: "Python",
        learners: "46,379,699 learners",
      },
      {
        course: "Web Development",
        learners: "13,735,483 learners",
      },
      {
        course: "Data Science",
        learners: "7,521,364 learners",
      },
    ],
  },
  {
    Design: [
      {
        course: "Blender",
        learners: "2,793,344 learners",
      },
      {
        course: "Graphic Design",
        learners: "4,392,842 learners",
      },
      {
        course: "User Experience (UX) Design",
        learners: "2,018,087 learners",
      },
    ],
  },
  {
    Business: [
      {
        course: "PMI Project Management Professional (PMP)",
        learners: "2,428,419 learners",
      },
      {
        course: "Microsoft Power BI",
        learners: "4,374,404 learners",
      },
      {
        course: "Project Management",
        learners: "3,781,282 learners",
      },
    ],
  },
];

const showTrendingSkills = () => {
  router.push("/");
};

setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.trend {
  padding: 32px 24px;
  background-color: #f7f9fa;
  color: #2d2f31;
  font-weight: 700;
  line-height: 1.2;
}

.heading {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #d1d7dc;
  margin: 0px;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2.4rem;
  margin-top: 32px;
}

.col-one h2,
.col-title {
  font-size: 25px;
  margin: 0px;
}

.col-title {
  font-size: 21px !important;
}

:deep(.ant-list .ant-row) {
  line-height: 1.2 !important;
}

.right-icon {
  font-size: 11px;
  margin-left: 4px;
  padding: 4px 0px;
}

a {
  display: inline-flex;
  text-decoration: none;
  color: #5022c3;
}

.chat {
  margin-top: 16px;
  display: flex;
  align-items: center;
}

.courses-skeleton {
  margin-left: 10px;
  width: 150px;
}

.ant-btn-link {
  color: #5022c3 !important;
  font-weight: 700 !important;
  font-size: 17px !important;
  padding: 0px !important;
}

.chat,
.topic {
  font-size: 17px;
}

.learners {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #6a6f73;
}

.rise-icon {
  padding-left: 4px;
}

.ant-btn-primary.btn {
  border: 1px solid #2d2f31;
  border-radius: 5px;
  background-color: #f7f9fa !important;
  color: #5022c3;
  height: 2.6rem !important;
  font-weight: 700;
  font-size: 16px !important;
}

.ant-btn-primary.btn:hover {
  background-color: #e4e8eb !important;
}

.col-one {
  display: flex;
  flex-direction: column;
  gap: 3.4rem 0;
}

.col-two {
  max-width: 75%;
}

.cols {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.6rem 0;
}

:deep(.courses-list.ant-list .ant-list-item.course-title) {
  padding: 0px;
}

.course-titles-skeleton {
  width: 270px;
  margin-bottom: 5px;
  padding-right: 70px;
}

:deep(.ant-list .ant-list-item.course-list-item) {
  padding: 24px 16px 0px 0px;
  margin: 0px;
}

:deep(
    .courses-list
      > .ant-spin-nested-loading
      > .ant-spin-container
      > .ant-row
      > div:nth-child(1)
  ) {
  width: 27% !important;
  max-width: 27% !important;
}

:deep(
    .courses-list
      > .ant-spin-nested-loading
      > .ant-spin-container
      > .ant-row
      > div:nth-child(2)
  ) {
  width: 32% !important;
  max-width: 32% !important;
}

:deep(
    .courses-list
      > .ant-spin-nested-loading
      > .ant-spin-container
      > .ant-row
      > div:nth-child(3)
  ) {
  width: 41% !important;
  max-width: 41% !important;
}
</style>
