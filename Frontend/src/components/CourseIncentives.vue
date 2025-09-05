<template>
  <div
    :class="{
      'side-bar-incentives': isCourseSidebar,
      'main-incentives': !isCourseSidebar,
    }"
  >
    <h2 class="incentive-title">This course includes:</h2>

    <!-- Incentives List -->
    <div :class="{ 'incentives-list-data': !isCourseSidebar }">
      <a-list
        size="small"
        :split="false"
        :class="isCourseSidebar ? 'sidebar-data' : 'incentives-data'"
        v-for="(group, groupIndex) in incentiveGroups"
        :key="groupIndex"
      >
        <a-list-item
          v-for="(item, index) in group"
          class="incentives-list"
          :key="index"
        >
          <div>
            <component :is="item?.icon" class="icons" v-if="item?.icon" />

            <a-image
              v-if="item?.image"
              :src="item?.image"
              alt="Incentive Image"
              :preview="false"
            />

            <span class="incentive-content">{{ item?.text }}</span>
          </div>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script setup>
import {
  AudioOutlined,
  FileTextOutlined,
  MobileOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons-vue";
import { ref, computed } from "vue";

const { data, isCourseSidebar } = defineProps({
  data: {
    type: Object,
    required: true,
  },
  isCourseSidebar: {
    type: Boolean,
    required: true,
  },
});

const courseData = ref(data);

const incentivesList = computed(() => [
  {
    condition: !!courseData.value.video_content_length,
    image: "/desktop_icon.png",
    text: `${courseData.value.video_content_length} on-demand video`,
  },
  {
    condition: !!courseData.value.num_coding_exercises,
    image: "/icons8-average-math-16.png",
    text: `${courseData.value.num_coding_exercises} coding exercises`,
  },
  {
    condition: !!courseData.value.num_practice_tests,
    icon: QuestionCircleOutlined,
    text: `${courseData.value.num_practice_tests} practice test`,
  },
  {
    condition: !!courseData.value.has_assignments,
    image: "/assignment_icon.png",
    text: `Assignments`,
  },
  {
    condition: !!courseData.value.audio_content_length,
    icon: AudioOutlined,
    text: `${courseData.value.audio_content_length} on-demand audio`,
  },
  {
    condition: courseData.value.num_articles > 0,
    icon: FileTextOutlined,
    text: `${courseData.value.num_articles} articles`,
  },
  {
    condition: courseData.value.num_additional_resources > 0,
    image: "/file_download_icon.png",
    text: `${courseData.value.num_additional_resources} downloadable resources`,
  },
  {
    condition: !!courseData.value.devices_access,
    icon: MobileOutlined,
    text: courseData.value.devices_access,
  },
  {
    condition: !!courseData.value.has_lifetime_access && isCourseSidebar,
    image: "/infinity.png",
    text: "Full lifetime access",
  },
  {
    condition: !!courseData.value.has_closed_captions,
    image: "/close-caption.png",
    text: "Closed captions",
  },
  {
    condition: !!courseData.value.has_certificate,
    icon: TrophyOutlined,
    text: "Certificate of completion",
  },
]);

const filteredIncentivesList = computed(() =>
  incentivesList.value.filter((item) => item.condition)
);

const incentivesListLength = filteredIncentivesList.value.length;

const incentiveGroups = computed(() => {
  return isCourseSidebar
    ? [filteredIncentivesList.value]
    : [
        filteredIncentivesList.value.slice(
          0,
          Math.ceil(incentivesListLength / 2)
        ),
        filteredIncentivesList.value.slice(Math.ceil(incentivesListLength / 2)),
      ];
});
</script>

<style scoped>
.side-bar-incentives {
  padding-top: 24px;
}

.incentive-title {
  margin: 0px 0px 8px;
  font-size: 16px;
}

.sidebar-data {
  padding: 0px;
  margin: 0px;
}

.incentives-list {
  padding: 4px 0px;
  list-style: none;
}

.icons {
  font-size: 14px;
}

.incentive-content {
  margin-left: 16px;
}

.main-incentives {
  padding-top: 16px;
  margin-bottom: 32px;
}

.main-incentives .incentive-title {
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 700;
}

.main-incentives .incentives-list-data {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

.main-incentives .incentives-data {
  margin: 0px;
  padding: 0px;
  width: calc(50% - (24px / 2));
}

.main-incentives .incentives-list {
  padding: 4px 0px;
  margin: 0px;
  font-family: "Udemy Sans";
  font-size: 16px;
  font-weight: 400;
  color: #303141 !important;
  line-height: 1.4;
}

.main-incentives .incentives-list div {
  display: flex;
  align-items: center;
}
</style>
