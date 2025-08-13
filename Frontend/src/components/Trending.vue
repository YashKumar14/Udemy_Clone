<template>
  <div class="main">
    <div class="trend">
      <div class="heading">
        <h1>Trending Now</h1>
      </div>

      <div class="content">
        <div class="col-one">
          <BlankSkeleton v-if="loading" />

          <div v-else>
            <h2>ChatGPT is a top skill</h2>
            <router-link id="chat" to="#">
              <span>See ChatGPT courses</span>
              <RightOutlined
                :style="{
                  fontSize: '11px',
                  margin: '0 0 0 4px',
                  padding: '4px 0px',
                }"
              />
            </router-link>
            <br />
            <span id="learners">3,788,431 learners</span>
          </div>

          <router-link id="btn" to="#">
            <span>Show all trending skills</span>
            <RiseOutlined :style="{ padding: '0 0 0 4px' }" />
          </router-link>
        </div>

        <div class="course" v-for="(topic, index) in topics" :key="index">
          <div class="cols" v-for="(courses, title) in topic" :key="title">
            <a-skeleton-button
              v-if="loading"
              active
              block
              size="large"
              :style="{ width: '150px', margin: '0px 0px 5px' }"
            />
            <span id="col-title" v-else>{{ title }}</span>

            <a-skeleton
              :loading="loading"
              active
              :paragraph="{ rows: 2 }"
              :style="{ margin: '0px 25px' }"
            />

            <div
              id="courses"
              v-for="(subTopics, index) in courses"
              :key="index"
              v-if="!loading"
            >
              <router-link id="topic" to="#">
                <span>{{ subTopics.course }}</span>

                <RightOutlined
                  :style="{
                    fontSize: '11px',
                    margin: '0 0 0 4px',
                    padding: '4px 0px',
                  }"
                />
              </router-link>
              <br />
              <span id="learners">{{ subTopics.learners }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BlankSkeleton from "@/skeletons/BlankSkeleton.vue";
import { RightOutlined, RiseOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";

const loading = ref(true);
const topics = ref([]);

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

setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style scoped>
.trend {
  padding: 32px 24px;
  background-color: #f7f9fa;
}

.heading {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 0px 16px;
  color: #2d2f31;
  border-bottom: 1px solid #d1d7dc;
}

.heading h1 {
  margin: 0px;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2.4rem;
  margin: 32px 0px 0px;
}

.col-one h2 {
  font-weight: 700;
  font-size: 25px;
  color: #2d2f31;
  margin: 0px;
  line-height: 1.2;
}

#col-title {
  font-weight: 700;
  font-size: 21px;
  color: #2d2f31;
  margin: 0px;
  line-height: 1.2;
}

a {
  display: inline-flex;
  text-decoration: none;
  text-align: left;
  white-space: normal;
  color: #5022c3;
}

.content a {
  cursor: pointer;
}

#chat {
  margin: 16px 0px 0px;
  font-size: 17px;
  font-weight: 700;
}

#topic {
  font-size: 17px;
  font-weight: 700;
}

#learners {
  display: inline-flex;
  margin: 8px 0px 0px;
  font-size: 14px;
  color: #6a6f73;
}

#btn {
  border: 1px solid #2d2f31;
  border-radius: 5px;
  color: #2d2f31;
  font-weight: 700;
  line-height: 1.2;
  height: 2.4rem;
  align-items: center;
  display: inline-flex;
  padding: 0px 12px;
  max-width: 100%;
  min-width: 8rem;
  white-space: nowrap;
}

#btn:hover {
  background-color: #e4e8eb;
}

.col-one {
  display: flex;
  flex-direction: column;
  gap: 3.4rem 0;
}

.cols {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1.6rem 0;
}
</style>
