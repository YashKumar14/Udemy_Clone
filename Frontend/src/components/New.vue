<template>
  <div class="slider-menu" v-if="showSliderMenu" ref="sliderMenu">
    <p id="slider-menu-title">{{ courseData.title }}</p>

    <div class="slider-menu-content">
      <div
        id="bestseller-badge"
        v-if="individualCourseData?.bestseller_badge_content?.badge_text"
      >
        {{ individualCourseData?.bestseller_badge_content?.badge_text }}
      </div>

      <StarRating
        id="slider-menu-rating"
        :starCount="1"
        :getCourseData="courseData"
        v-if="courseData && Object.keys(courseData).length > 0"
      />
    </div>
  </div>

  <div ref="content" class="main">
    <a-skeleton
      class="custom-skeleton"
      v-if="loading"
      active
      :paragraph="{ rows: 7 }"
      style="width: 50%"
    />
    <div class="left-content" v-else>
      <div id="course-categories">
        <a href=""> {{ individualCourseData.primary_category?.title }} </a>

        <RightOutlined class="right-arrow-icon" />

        <a href=""> {{ individualCourseData.primary_subcategory?.title }} </a>

        <RightOutlined class="right-arrow-icon" />

        <a href="">
          {{ individualCourseData?.context_info?.label?.title }}
        </a>
      </div>

      <h1>
        {{ courseData.title }}
      </h1>

      <h3>
        {{ courseData.headline }}
      </h3>

      <StarRating
        :starCount="5"
        :getCourseData="courseData"
        v-if="
          !individualCourseData?.bestseller_badge_content?.badge_text &&
          courseData &&
          Object.keys(courseData).length > 0
        "
      />

      <div id="bestseller-badge" v-else>
        {{ individualCourseData?.bestseller_badge_content?.badge_text }}
      </div>

      <h4 id="instructor">
        Created by
        <a href="#">{{
          courseData.visible_instructors?.map((user) => user.title).join(", ")
        }}</a>
      </h4>

      <div class="details-container">
        <CalendarOutlined
          class="course-details"
          :style="{ fontSize: '14px' }"
        />

        <span class="course-details">Last updated</span>

        <span class="course-details">
          {{ formattedDate }}
        </span>

        <GlobalOutlined class="course-details" :style="{ fontSize: '14px' }" />

        <span class="course-details">English</span>

        <span id="subtitle-container" v-if="!showAllCaptionLang">
          <img class="subtitle-icon" src="/subtitle-icon.png" />
        </span>

        <span class="course-captions" v-if="!showAllCaptionLang">
          {{
            `${individualCourseData?.caption_languages?.slice(0, 2).join(", ")}`
          }}
        </span>

        <a
          @click="watchMoreLanguages"
          v-if="
            !showAllCaptionLang &&
            individualCourseData?.caption_languages?.length > 2
          "
        >
          {{ `, ${individualCourseData?.caption_languages.length - 2} more` }}
        </a>
      </div>

      <div class="course-captions" v-if="showAllCaptionLang">
        <span id="subtitle-container">
          <img class="subtitle-icon" src="/subtitle-icon.png" />
        </span>
        {{ individualCourseData?.caption_languages?.join(", ") }}
      </div>
    </div>

    <CourseSideBar
      @courseData="updateIncentivesData"
      :individualCourseData="individualCourseData"
      :footerTop="footerTop"
      :courseBodyTop="courseBodyTop"
      :sliderMenuBottom="sliderMenuBottom"
    />

    <Badge
      v-if="
        individualCourseData?.is_in_personal_plan_collection &&
        courseData &&
        Object.keys(courseData).length > 0
      "
      :getCourseData="courseData"
    />
  </div>

  <div
    class="spacer"
    v-if="individualCourseData?.is_in_personal_plan_collection"
  ></div>

  <div id="course-body" ref="courseBody">
    <div id="course-body-content">
      <div
        :class="{
          'course-objectives-show-more': !isExpanded && showButton,
          'course-objectives-show-less': isExpanded && showButton,
        }"
      >
        <h2 id="objective-title">What you'll learn</h2>

        <ul
          id="objectives"
          ref="objectivesList"
          :class="{ 'show-more': isExpanded, 'show-less': !isExpanded }"
        >
          <li
            id="objectives-list"
            v-for="(item, index) in individualCourseData
              ?.what_you_will_learn_data?.items"
            :key="index"
          >
            <div>
              <CheckOutlined id="check-icon" />
              <span id="objective-item">
                {{ item }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <a-button
        v-if="showButton"
        type="text"
        @click="toggleContent"
        class="show-module-btn"
      >
        <div id="expand-content">
          <span id="show-btn">{{
            isExpanded ? "Show Less" : "Show More"
          }}</span>
          <UpOutlined v-if="isExpanded" class="arrow-icon" />
          <DownOutlined v-else class="arrow-icon" />
        </div>
      </a-button>
    </div>

    <div id="explore-container">
      <h2>Explore related topics</h2>
      <div id="related-topics">
        <a-button
          id="topic"
          type="link"
          href="#"
          v-for="(topic, index) in exploreRelatedTopics"
          :key="index"
        >
          {{ topic }}
        </a-button>
      </div>
    </div>

    <CourseIncentives
      :data="incentivesData"
      :isCourseSidebar="false"
      v-if="
        Object.values(incentivesData).some((value) => value !== undefined) &&
        individualCourseData.is_in_personal_plan_collection
      "
    />

    <!-- <div id="course-offered-companies">
      <h2>Top companies offer this course to their employees</h2>
      <span>
        This course was selected for our collection of top-rated courses trusted
        by businesses worldwide.
        <a href="#">Learn more</a>
      </span>
    </div> -->

    <div>
      <h2 id="course-content-title">Course content</h2>
      <div id="content-data">
        <p>
          {{ incentivesData?.curriculum_data?.sections.length }} sections
          <span
            id="dot-icon"
            v-html="dotUnicode"
            style="font-size: 10px"
          ></span>
          {{ incentivesData?.curriculum_data?.num_of_published_lectures }}
          lectures
          <span
            id="dot-icon"
            v-html="dotUnicode"
            style="font-size: 10px"
          ></span>
          {{
            formattedDuration(
              incentivesData?.curriculum_data?.estimated_content_length_text ??
                ""
            )
          }}
          total length
        </p>
        <a-button type="text" id="expand-section" @click="toggleSections">
          {{ expandSections ? "Collapse all sections" : "Expand all sections" }}
        </a-button>
      </div>

      <div class="course-list" v-if="visibleSections">
        <div
          id="section-container"
          v-for="(section, index) in visibleSections"
          :key="index"
        >
          <div
            id="section-details"
            :class="{
              'sec-title': !isSectionExpanded.includes(index),
            }"
          >
            <a-button
              type="text"
              id="course-btn"
              @click="handleCourseSection(index)"
            >
              <DownOutlined
                v-if="!isSectionExpanded.includes(index)"
                id="arrow-icon"
              />
              <UpOutlined v-else id="arrow-icon" />
            </a-button>
            <span id="section-title">{{ section.title }}</span>
            <span id="section-duration">
              {{ section.lecture_count }}
              {{ section.lecture_count === 1 ? "lecture" : "lectures" }}
              <span
                id="dot-icon"
                v-html="dotUnicode"
                style="font-size: 10px"
              ></span>
              {{ formattedDuration(section.content_length ?? "") }}
            </span>
          </div>

          <div class="course-topics" v-if="isSectionExpanded.includes(index)">
            <a-list
              v-for="(item, itemIndex) in section.items"
              :key="itemIndex"
              :class="{ 'is-course-preview': item.can_be_previewed }"
              :split="false"
            >
              <a-list-item @click="">
                <template v-if="(icon = displayIcon(item.icon_class))">
                  <component :is="icon.icon" class="icons" v-if="icon.icon" />
                  <img
                    :src="icon.image"
                    :class="{
                      icons: true,
                      'presentation-icon':
                        icon.icon_class === 'udi udi-presentation',
                    }"
                    alt="Incentive Image"
                    v-else
                  />
                </template>

                <span id="course-subtitle">
                  <span id="subtitle"> {{ item.title }}</span>
                  <span id="content-desc" v-if="item.description">
                    <a-button
                      type="text"
                      id="desc-btn"
                      @click="handleDescription(index, itemIndex)"
                    >
                      <DownCircleFilled
                        v-if="!showDescription[index]?.includes(itemIndex)"
                        id="view-desc-icon"
                      />
                      <UpCircleFilled v-else id="view-desc-icon" />
                    </a-button>
                  </span>
                </span>

                <a-button
                  type="link"
                  v-if="item.can_be_previewed"
                  id="preview-btn"
                  :class="{
                    'preview-btn-desc':
                      showDescription[index]?.includes(itemIndex) &&
                      item.can_be_previewed,
                  }"
                >
                  Preview
                </a-button>
                <a-modal></a-modal>
                <span id="content-time">
                  {{ item.content_summary }}
                </span>
              </a-list-item>
              <span
                id="description"
                v-if="showDescription[index]?.includes(itemIndex)"
                v-html="item.description"
              ></span>
            </a-list>
          </div>
        </div>
      </div>

      <a-button
        v-if="
          incentivesData?.curriculum_data?.sections.length > 10 && showMoreBtn
        "
        @click="showMoreSections"
        id="show-more-btn"
      >
        {{ incentivesData?.curriculum_data?.sections.length - 10 }} more
        sections
      </a-button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, onUnmounted, onUpdated, ref, watch } from "vue";
import {
  AudioOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckOutlined,
  DownCircleFilled,
  DownOutlined,
  FileTextOutlined,
  GlobalOutlined,
  PlaySquareOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  UpCircleFilled,
  UpOutlined,
} from "@ant-design/icons-vue";
import StarRating from "./StarRating.vue";
import { fetchCourseData } from "../utils/courseFetchApi.js";
import CourseSideBar from "./CourseSideBar.vue";
import Badge from "./Badge.vue";
import CourseIncentives from "./CourseIncentives.vue";

const { footerTop } = defineProps({
  footerTop: {
    type: Number,
    required: true,
  },
});

const { courseDetails } = fetchCourseData();
const courseData = ref({});
const courseCount = ref("");
const showSliderMenu = ref(false);
const content = ref(null);
const showAllCaptionLang = ref(false);
const loading = ref(true);
const courseId = ref(localStorage.getItem("setSelectedCourseId"));
const courseInstructorId = ref(
  localStorage.getItem("setSelectedCourseInstructorId")
);
const courseLastUpdate = ref("");
const individualCourseData = ref({});
const isExpanded = ref(false);
const showButton = ref(false);
const objectivesList = ref(null);
const exploreRelatedTopics = ref();
const incentivesData = ref({});
const dotUnicode = "&#8226;";
const showDescription = ref({});
const isSectionExpanded = ref([]);
const visibleSectionsCount = ref(10);
const showMoreBtn = ref(true);
const expandSections = ref(false);
const sliderMenu = ref(null);
const courseBody = ref(null);
const courseBodyTop = ref(0);
const sliderMenuBottom = ref(0);

const courseIcons = [
  {
    icon_class: "udi udi-article",
    icon: FileTextOutlined,
  },
  {
    icon_class: "udi udi-video",
    image: "/desktop_icon.png",
  },
  {
    icon_class: "udi udi-video-mashup",
    icon: PlaySquareOutlined,
  },
  {
    icon_class: "udi udi-quiz",
    icon: BulbOutlined,
  },
  {
    icon_class: "udi udi-coding-exercise",
    image: "/icons8-average-math-16.png",
  },
  {
    icon_class: "udi udi-practice-test",
    icon: QuestionCircleOutlined,
  },
  {
    icon_class: "udi udi-assignment",
    image: "/assignment_icon.png",
  },
  {
    icon_class: "udi udi-file",
    icon: FileTextOutlined,
  },
  {
    icon_class: "udi udi-audio",
    icon: AudioOutlined,
  },
  {
    icon_class: "udi udi-presentation",
    image: "/presentation64.png",
  },
];

const displayIcon = (iconClass) => {
  const match = courseIcons.find(
    (iconItem) => iconItem.icon_class === iconClass
  );
  return match || { icon: null, image: null };
};

const updateIncentivesData = (value) => {
  incentivesData.value = value;
  console.log(incentivesData.value);
};

const formattedDate = computed(() => {
  const date = new Date(individualCourseData.value.last_update_date);
  return `${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}/${date.getFullYear()}`;
});

const formattedDuration = (contentLength) => {
  if (!isNaN(contentLength)) {
    const hours = Math.floor(contentLength / 3600);
    const minutes = Math.floor((contentLength % 3600) / 60);

    return hours === 0 ? `${minutes}min` : `${hours}hr ${minutes}min`;
  } else {
    const timeStr = contentLength || "";
    const [hours = 0, minutes = 0, seconds = 0] = timeStr
      .split(":")
      .map(Number);

    return `${hours}h ${minutes}m`;
  }
};

const fetchCourseApi = async () => {
  try {
    const response = await courseDetails(
      courseId.value,
      courseInstructorId.value
    );
    courseData.value = response.courseData;
    loading.value = false;
    console.log("Fetched courseData:", courseData.value);
  } catch (error) {
    console.error("Error fetching course data:", error);
    loading.value = false;
  }
};

const individualCourse = async () => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/courses/${courseId.value}/?fields[course]=@all`
    );
    console.log(response.data);
    individualCourseData.value = response.data;
    courseLastUpdate.value = response.data.last_update_date;

    exploreRelatedTopics.value = [
      ...individualCourseData.value.course_has_labels
        .filter((item) => item.is_primary)
        .map((item) => item.label.title),
      individualCourseData.value.primary_subcategory?.title,
      individualCourseData.value.primary_category?.title,
    ].filter(Boolean);
  } catch (error) {
    console.log("Error while fetching individual course api: ", error);
  }
};

const watchMoreLanguages = () => {
  showAllCaptionLang.value = true;
};

const handleScroll = () => {
  if (content.value) {
    const contentTop = content.value.getBoundingClientRect().top;

    showSliderMenu.value = contentTop <= 0;
  }

  if (showSliderMenu.value) {
    calculatePositions();
  }
};

const checkHeight = () => {
  const objectivesDiv = objectivesList.value;
  const contentHeight = objectivesDiv.scrollHeight;
  const viewportHeight = 600;

  if (contentHeight > 300) {
    showButton.value = contentHeight > viewportHeight * 0.25;
  }

  document.documentElement.style.setProperty(
    "--dynamic-maxHeight",
    contentHeight < 300 ? "280px" : "190px"
  );
  console.log("checkHeight::", contentHeight, viewportHeight * 0.5);
};

const toggleContent = () => {
  isExpanded.value = !isExpanded.value;
};

const handleDescription = (index, subIndex) => {
  if (!showDescription.value[index]) {
    showDescription.value[index] = [];
  }

  const isVisible = showDescription.value[index].includes(subIndex);

  if (isVisible) {
    showDescription.value[index] = showDescription.value[index].filter(
      (item) => item !== subIndex
    );
  } else {
    showDescription.value[index].push(subIndex);
  }
};

const handleCourseSection = (index) => {
  const isSectionVisible = isSectionExpanded.value.includes(index);
  console.log("isSectionExpanded", isSectionExpanded.value);

  if (isSectionVisible) {
    isSectionExpanded.value = isSectionExpanded.value.filter(
      (item) => item !== index
    );
  } else {
    isSectionExpanded.value.push(index);
  }
};

const visibleSections = computed(() => {
  return incentivesData.value?.curriculum_data?.sections.slice(
    0,
    visibleSectionsCount.value
  );
});

const showMoreSections = () => {
  visibleSectionsCount.value =
    incentivesData.value?.curriculum_data?.sections.length;
  showMoreBtn.value = false;
};

const toggleSections = () => {
  if (expandSections.value) {
    isSectionExpanded.value = [];
    showMoreBtn.value = false;
  } else {
    isSectionExpanded.value =
      incentivesData.value?.curriculum_data?.sections.map((_, index) => index);
    showMoreSections();
  }
  console.log("expandSections:", expandSections.value);

  expandSections.value = !expandSections.value;
};

individualCourse();

const calculatePositions = () => {
  if (sliderMenu.value && courseBody.value) {
    const sliderMenuRect = sliderMenu.value.getBoundingClientRect();
    const courseBodyRect = courseBody.value.getBoundingClientRect();

    sliderMenuBottom.value = sliderMenuRect.bottom + window.scrollY;

    setTimeout(() => {
      courseBodyTop.value = courseBodyRect.top + window.scrollY;
    }, 100);
    console.log("courseBodyRect.top", courseBodyRect.top);
    console.log("window.scrollY", window.scrollY);
    console.log("courseBodyTop", courseBodyTop.value);
    console.log("sliderMenuBottom", sliderMenuBottom.value);
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
  fetchCourseApi();
  setTimeout(() => {
    checkHeight();
  }, 1000);
  isSectionExpanded.value.push(0);
  window.addEventListener("resize", calculatePositions);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", calculatePositions);
});
</script>

<style scoped>
.spacer {
  height: 70px;
  background-color: #fff;
}

.main {
  display: flex;
  background-color: #1d1e27;
  padding: 32px 40px;
  position: relative;
}

.slider-menu {
  position: sticky;
  top: 0;
  background-color: #1d1e27;
  padding: 10px;
  font-size: 8px 16px;
  font-weight: 700;
  z-index: 100;
}

.slider-menu-content {
  display: flex;
}

#bestseller-badge {
  display: flex;
  align-items: center;
  background-color: #c2e9eb;
  color: #0d5261;
  padding: 4px 8px;
  font-weight: 700;
  font-size: 12px;
  border-radius: 4px;
  width: fit-content;
  line-height: 1.2;
  margin: 0px 8px 0px 0px;
}

#slider-menu-rating {
  display: flex;
  align-items: center;
}

#slider-menu-title {
  margin: 0px 0px 4px;
}

.slider-menu,
.main,
#instructor {
  color: #fff;
}

.left-content {
  margin: 20px 30px;
  width: 700px;
}

#course-categories a {
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}

#course-categories {
  margin: 0px 0px 24px;
}

.right-arrow-icon {
  color: #fff;
  font-size: 10px;
  margin: 0px 4px;
}

.left-content h1 {
  margin: 0px 0px 16px;
  font-size: 32px;
  font-weight: 700;
}

.left-content h3 {
  font-size: 18px;
  font-weight: 400;
  margin: 0px 0px 16px;
}

a {
  color: #c0c4fc;
  text-decoration: underline;
  cursor: pointer;
}

#subtitle-container {
  vertical-align: middle;
  padding-right: 6px;
}

.subtitle-icon {
  width: 14px;
  height: 14px;
  filter: invert(100%);
}

.details-container,
.course-captions {
  margin: 0px 0px 16px;
}

#instructor {
  margin: 16px 0px;
}

#instructor,
a,
.course-captions,
.course-details {
  font-size: 14px;
  font-weight: 400;
}

.course-details {
  padding-right: 6px;
}

#course-body {
  padding: 32px 0px 0px;
  margin: 0px 70px;
  background-color: #fff;
  color: #303141;
  width: 700px;
}

#course-body-content {
  border: 1px solid #d1d2e0;
  margin: 0px 0px 32px;
  padding: 24px 0px 16px;
}

.course-objectives-show-more {
  -webkit-mask-image: linear-gradient(#ffffff, #ffffff, rgba(255, 255, 255, 0));
}

#objective-title {
  margin: 0px 24px 16px;
}

#objectives {
  margin: 0px 24px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 0px;
}

#objectives-list {
  list-style: none;
  padding: 4px 0px;
  margin: 0px;
  font-size: 14px;
  width: calc(50% - (24px / 2));
}

#check-icon {
  font-size: 14px;
}

#objectives-list div {
  display: flex;
}

#objective-item {
  display: -webkit-box !important;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin: 0px 0px 0px 16px;
  font-size: 14px;
  font-weight: 400;
  font-family: "Udemy Sans", "SF Pro Text", "-apple-system",
    "BlinkMacSystemFont", "Roboto", "Segoe UI", Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

#expand-content {
  color: #6d28d2;
  font-weight: 700;
  font-size: 14px;
}

.show-module-btn {
  padding: 0px 4px !important;
  margin: 5px 0px 0px 20px;
  border-radius: 4px;
  height: 40px;
}

.show-module-btn:hover {
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}

.arrow-icon {
  margin: 0px 0px 0px 4px;
  font-size: 10px;
  color: #6d28d2;
}

#objectives.show-less {
  max-height: var(--dynamic-maxHeight);
  overflow: hidden;
}

#objectives.show-more {
  max-height: none;
  overflow: visible;
}

#explore-container {
  margin: 0px 0px 32px;
}

#explore-container h2 {
  margin: 0px 0px 16px;
}

#related-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

#topic {
  padding: 5px 12px;
  border: 1px solid #9194ac;
  border-radius: 4px;
  color: #303141;
  background-color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 700;
  height: 34px;
}

#topic:hover {
  background-color: #f6f7f9;
}

#course-content-title {
  margin: 0px 0px 16px;
  font-weight: 700;
}

#content-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#content-data p {
  margin: 8px 0px !important;
  font-weight: 400;
  font-size: 14px;
}

#expand-section {
  color: #6d28d2;
  font-weight: 700 !important;
  height: 40px;
}

#section-container,
#section-details {
  border: 1px solid #d1d2e0;
}

#section-container {
  border-top: none;
  border-bottom: none;
  position: relative;
}

#section-details {
  border-left: none;
  border-right: none;
  background-color: #f6f7f9;
  display: flex;
  align-items: baseline;
}

#arrow-icon {
  font-size: 12px;
  color: #2a2b3f;
}

.course-list {
  border-bottom: 1px solid #d1d2e0;
}

#section-title {
  margin: 0px 0px 0px 10px;
  font-size: 16px;
  font-weight: 700;
  max-width: 75%;
  display: flex;
}

.sec-title {
  border-bottom: none !important;
}

#section-details,
.course-topics {
  padding: 16px 24px;
}

#section-duration {
  margin-left: auto;
  color: #2a2b3f;
  font-weight: 400;
  font-size: 14px;
}

:deep(.ant-list-item) {
  padding: 8px 0px !important;
  font-size: 14px;
  font-weight: 400;
  box-sizing: border-box;
}

#course-subtitle {
  color: #2a2b3f;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.is-course-preview #course-subtitle,
:deep(.is-course-preview .ant-btn-link span) {
  text-decoration: underline !important;
  color: #6d28d2;
  display: flex;
  align-items: center;
  max-width: 75%;
}

.is-course-preview:hover,
:deep(.is-course-preview .ant-btn-link span):hover {
  color: #5022c3;
  cursor: pointer;
}

:deep(.is-course-preview #content-time) {
  text-decoration: none !important;
}

:deep(.ant-list-item #content-time) {
  color: #595c73;
  margin: 0px 0px 0px 32px;
  margin-left: auto;
}

:deep(.is-course-preview .ant-btn-link) {
  padding: 0px !important;
  height: 22px;
}

:deep(.ant-list-item #preview-btn) {
  position: absolute;
  right: 70px;
}

.preview-btn-desc {
  position: absolute;
  top: 50%;
}

.icons {
  width: 14px;
  height: 14px;
  margin: 0px 16px 0px 0px;
}

.presentation-icon {
  width: 18px;
  height: 20px;
}

#content-desc {
  margin: 0px 0px 0px 10px;
}

#desc-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d2f31;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  padding: 0px 0px 0px 5px;
}

#view-desc-icon {
  font-size: 25px;
  color: #f6f7f9;
  margin: 0px 10px 0px 0px;
}

#course-btn {
  padding: 0px;
  background-color: #f6f7f9;
  height: 0px;
}

:deep(#description p) {
  margin: 0px 0px 0px 30px !important;
  padding: 8px 0px 0px;
  color: #595c73;
  font-size: 14px;
  font-weight: 400;
  max-width: 400px;
  position: relative;
}

:deep(#description p):hover {
  color: #595c73;
}

#show-more-btn {
  margin: 16px 0px 0px;
  width: 700px;
  height: 40px;
  color: #6d28d2;
  border: 1px solid #6d28d2;
  font-size: 14px;
  font-weight: 700;
}

#show-more-btn:hover {
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}
</style>
