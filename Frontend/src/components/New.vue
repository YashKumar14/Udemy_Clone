<template>
  <!-- Slider Menu -->
  <div class="slider-menu" v-if="showSliderMenu" ref="sliderMenu">
    <p class="slider-menu-title">{{ courseData.title }}</p>

    <div class="slider-menu-content">
      <div
        class="bestseller-badge"
        v-if="individualCourseData?.bestseller_badge_content?.badge_text"
      >
        {{ individualCourseData?.bestseller_badge_content?.badge_text }}
      </div>

      <!-- Star Rating component -->
      <StarRating
        class="slider-menu-rating"
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
    />

    <div class="left-content" v-else>
      <!-- Course Categories -->
      <div class="course-categories">
        <a-button type="link" href="">
          {{ individualCourseData.primary_category?.title }}
        </a-button>

        <RightOutlined
          class="right-arrow-icon"
          v-if="individualCourseData.primary_category?.title"
        />

        <a-button type="link" href="">
          {{ individualCourseData.primary_subcategory?.title }}
        </a-button>

        <RightOutlined
          class="right-arrow-icon"
          v-if="individualCourseData?.context_info?.label?.title"
        />

        <a-button type="link" href="">
          {{ individualCourseData?.context_info?.label?.title }}
        </a-button>
      </div>

      <!-- Course Title -->
      <h1>
        {{ courseData.title }}
      </h1>

      <!-- Course Subtitle -->
      <h3>
        {{ courseData.headline }}
      </h3>

      <!-- Star Rating Component -->
      <StarRating
        :starCount="5"
        :getCourseData="courseData"
        v-if="
          !individualCourseData?.bestseller_badge_content?.badge_text &&
          courseData &&
          Object.keys(courseData).length > 0
        "
      />

      <!-- Bestseller Badge -->
      <div class="bestseller-badge" v-else>
        {{ individualCourseData?.bestseller_badge_content?.badge_text }}
      </div>

      <!-- Course Instructors -->
      <h4 class="instructor">
        Created by

        <!-- Instructor Details Button -->
        <a-button type="link" href="#">
          {{ courseData.visible_instructors[0].title.split(" |").join(", ") }}
        </a-button>
      </h4>

      <div class="details-container">
        <CalendarOutlined class="course-details calendar-icon" />

        <span class="course-details">Last updated</span>

        <span class="course-details">
          {{ formattedDate }}
        </span>

        <GlobalOutlined class="course-details globe-icon" />

        <span class="course-details">English</span>

        <a-image
          class="subtitle-icon"
          src="/subtitle-icon.png"
          :preview="false"
          v-if="!showAllCaptionLang"
        />

        <!-- Course Captions -->
        <span class="course-captions" v-if="!showAllCaptionLang">
          {{
            `${individualCourseData?.caption_languages
              ?.slice(0, 2)
              .join(", ")},`
          }}
        </span>

        <!-- See more captions Button -->
        <a-button
          type="link"
          class="expand-subtitles"
          @click="expandSubtitles"
          v-if="
            !showAllCaptionLang &&
            individualCourseData?.caption_languages?.length > 2
          "
        >
          {{ `${individualCourseData?.caption_languages.length - 2} more` }}
        </a-button>
      </div>

      <!-- Expanded Captions -->
      <div class="course-captions" v-if="showAllCaptionLang">
        <a-image
          class="subtitle-icon"
          src="/subtitle-icon.png"
          :preview="false"
        />

        <span>
          {{ individualCourseData?.caption_languages?.join(", ") }}
        </span>
      </div>
    </div>

    <!-- Course Sidebar component -->
    <CourseSideBar
      @courseData="updateIncentivesData"
      :individualCourseData="individualCourseData"
      :footerTop="footerTop"
      :courseBodyTop="courseBodyTop"
      :sliderMenuBottom="sliderMenuBottom"
      :courseId="courseId"
      v-if="courseId && individualCourseData"
    />

    <!-- Premium Badge component -->
    <Badge
      v-if="
        individualCourseData?.is_in_personal_plan_collection &&
        courseData &&
        Object.keys(courseData).length > 0
      "
      :getCourseData="courseData"
    />
  </div>

  <!-- Spacer -->
  <div
    class="spacer"
    v-if="individualCourseData?.is_in_personal_plan_collection"
  ></div>

  <!-- Course content -->
  <div class="course-body" ref="courseBody">
    <div class="course-body-content">
      <div
        :class="{
          'course-objectives-show-more': !isExpanded && showButton,
          'course-objectives-show-less': isExpanded && showButton,
        }"
      >
        <h2 class="objective-title">What you'll learn</h2>

        <!-- Course Objectives List -->
        <a-list
          :split="false"
          :grid="{ gutter: 8, column: 2 }"
          :data-source="individualCourseData?.what_you_will_learn_data?.items"
          ref="objectivesList"
          :class="[isExpanded ? 'show-more' : 'show-less', 'objectives']"
        >
          <template #renderItem="{ item }">
            <a-list-item :key="item" class="objectives-list">
              <div class="objectives-content">
                <CheckOutlined class="check-icon" />

                <span class="objective-item">
                  {{ item }}
                </span>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>

      <!-- Objectives show less/more Buttons -->
      <a-button
        v-if="showButton"
        type="text"
        @click="toggleContent"
        class="show-module-btn"
      >
        <div class="expand-content">
          <span>
            {{ isExpanded ? "Show Less" : "Show More" }}
          </span>

          <UpOutlined v-if="isExpanded" class="arrow-icon" />

          <DownOutlined v-else class="arrow-icon" />
        </div>
      </a-button>
    </div>

    <!-- Explore Related Topics -->
    <div class="explore-container">
      <h2>Explore related topics</h2>

      <div class="related-topics">
        <a-button
          class="topic"
          type="link"
          href="#"
          v-for="(topic, index) in exploreRelatedTopics"
          :key="index"
        >
          {{ topic }}
        </a-button>
      </div>
    </div>

    <!-- Course Incentives Component -->
    <CourseIncentives
      :data="incentivesData"
      :isCourseSidebar="false"
      v-if="
        hasValidIncentives &&
        individualCourseData?.is_in_personal_plan_collection
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
      <h2 class="course-content-title">Course content</h2>

      <!-- Course Data -->
      <div class="content-data">
        <p>
          {{ incentivesData?.curriculum_data?.sections?.length }} sections

          <span class="dot-icon" v-html="dotUnicode"></span>

          {{ incentivesData?.curriculum_data?.num_of_published_lectures }}
          lectures
          <span class="dot-icon" v-html="dotUnicode"></span>

          {{
            formattedDuration(
              incentivesData?.curriculum_data?.estimated_content_length_text ??
                ""
            )
          }}
          total length
        </p>

        <!-- Sections Expand/Collapse Button -->
        <a-button type="text" class="expand-section" @click="toggleSections">
          {{ expandSections ? "Collapse all sections" : "Expand all sections" }}
        </a-button>
      </div>

      <!-- Course Sections List -->
      <div class="course-list" v-if="visibleSections">
        <div
          class="section-container"
          v-for="(section, index) in visibleSections"
          :key="index"
        >
          <div
            :class="{
              'sec-title': !isSectionExpanded.includes(index),
              'section-details': true,
            }"
          >
            <!-- Section Button -->
            <a-button
              type="text"
              class="course-btn"
              @click="handleCourseSection(index)"
            >
              <DownOutlined
                v-if="!isSectionExpanded.includes(index)"
                class="title-arrow-icon"
              />

              <UpOutlined v-else class="title-arrow-icon" />
            </a-button>

            <!-- Section Title -->
            <span class="section-title">{{ section.title }}</span>

            <!-- Section Duration -->
            <span class="section-duration">
              {{ section.lecture_count }}

              {{ section.lecture_count === 1 ? "lecture" : "lectures" }}

              <span class="dot-icon" v-html="dotUnicode"></span>

              {{ formattedDuration(section.content_length ?? "") }}
            </span>
          </div>

          <!-- Course Topics List -->
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

                <span class="course-subtitle">
                  <span> {{ item.title }}</span>

                  <!-- Course Description Button -->
                  <a-button
                    type="text"
                    class="desc-btn"
                    @click="handleDescription(index, itemIndex)"
                    v-if="item.description"
                  >
                    <DownCircleFilled
                      v-if="!showDescription[index]?.includes(itemIndex)"
                      class="view-desc-icon"
                    />

                    <UpCircleFilled v-else class="view-desc-icon" />
                  </a-button>
                </span>

                <a-button
                  type="link"
                  v-if="item.can_be_previewed"
                  :class="{
                    'preview-btn-desc':
                      showDescription[index]?.includes(itemIndex) &&
                      item.can_be_previewed,
                    'preview-btn': true,
                  }"
                >
                  Preview
                </a-button>

                <a-modal></a-modal>

                <span class="content-time">
                  {{ item.content_summary }}
                </span>
              </a-list-item>

              <span
                class="description"
                v-if="showDescription[index]?.includes(itemIndex)"
                v-html="item.description"
              ></span>
            </a-list>
          </div>
        </div>
      </div>

      <!-- Show more sections Button -->
      <a-button
        v-if="
          incentivesData?.curriculum_data?.sections?.length > 10 && showMoreBtn
        "
        @click="showMoreSections"
        class="show-more-btn"
      >
        {{ incentivesData?.curriculum_data?.sections?.length - 10 }} more
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
import { useRoute } from "vue-router";

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
const courseId = ref();
const courseInstructorId = ref();
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
const selectedCourses = JSON.parse(localStorage.getItem("selectedCourses"));
const route = useRoute();

const courseTitle = ref(route.params.title);

const getCourseDetails = () => {
  selectedCourses.forEach((course) => {
    if (course.courseSlugTitle === courseTitle.value) {
      courseId.value = course.id;
      courseInstructorId.value = course.instructorId;

      console.log({
        courseId: courseId.value,
        courseInstructorId: courseInstructorId.value,
      });
    }
  });
};

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
  console.log("incentivesData::::", incentivesData.value);
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
    individualCourseData.value = response.data;

    // console.log({ individualCourseData: individualCourseData.value });

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

const hasValidIncentives = computed(() => {
  if (!incentivesData.value) return false;

  return Object.values(incentivesData.value).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null)
      return Object.keys(value).length > 0;
    return Boolean(value); // non-empty string, non-zero number, true boolean
  });
});

const expandSubtitles = () => {
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
  const objectivesDiv = objectivesList.value?.$el;
  if (!objectivesDiv) return;

  const contentHeight = objectivesDiv.scrollHeight || 0;

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
  return incentivesData.value?.curriculum_data?.sections?.slice(
    0,
    visibleSectionsCount.value
  );
});

const showMoreSections = () => {
  visibleSectionsCount.value =
    incentivesData.value?.curriculum_data?.sections?.length;
  showMoreBtn.value = false;
};

const toggleSections = () => {
  if (expandSections.value) {
    isSectionExpanded.value = [];
    showMoreBtn.value = false;
  } else {
    isSectionExpanded.value =
      incentivesData.value?.curriculum_data?.sections?.map((_, index) => index);
    showMoreSections();
  }
  console.log("expandSections:", expandSections.value);

  expandSections.value = !expandSections.value;
};

const calculatePositions = () => {
  if (sliderMenu.value && courseBody.value) {
    const sliderMenuRect = sliderMenu.value.getBoundingClientRect();
    const courseBodyRect = courseBody.value.getBoundingClientRect();

    sliderMenuBottom.value = sliderMenuRect.bottom + window.scrollY;

    setTimeout(() => {
      courseBodyTop.value = courseBodyRect.top + window.scrollY;
    }, 100);
    // console.log("courseBodyRect.top", courseBodyRect.top);
    // console.log("window.scrollY", window.scrollY);
    // console.log("courseBodyTop", courseBodyTop.value);
    // console.log("sliderMenuBottom", sliderMenuBottom.value);
  }
};

onMounted(() => {
  getCourseDetails();
  handleScroll();
  fetchCourseApi();
  setTimeout(() => {
    checkHeight();
  }, 1000);
  isSectionExpanded.value.push(0);
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", calculatePositions);
  individualCourse();
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

.slider-menu-title {
  margin: 0px 0px 4px;
}

.slider-menu-content {
  display: flex;
}

.bestseller-badge {
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
  margin-right: 8px;
}

.slider-menu-rating {
  display: flex;
  align-items: center;
}

.slider-menu,
.main,
.instructor {
  color: #fff;
}

.custom-skeleton {
  width: 50%;
}

.left-content {
  margin: 20px 30px;
  width: 700px;
}

.course-categories a {
  color: #c0c4fc !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}

.course-categories {
  margin-bottom: 24px;
}

:deep(.course-categories .ant-btn),
:deep(.instructor .ant-btn),
:deep(.expand-subtitles.ant-btn) {
  padding: 0px;
  height: auto;
  line-height: 1.2;
}

:deep(.instructor span),
:deep(.expand-subtitles span) {
  color: #c0c4fc !important;
  text-decoration: underline;
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

:deep(.subtitle-icon.ant-image-img) {
  width: 14px;
  height: 14px;
  filter: invert(100%);
  margin: 0px 6px 2px 0px;
}

.expand-subtitles {
  margin-left: 5px;
}

.details-container,
.course-captions {
  margin-bottom: 16px;
}

.instructor {
  margin: 16px 0px;
}

.instructor,
a,
.course-captions,
.course-details {
  font-size: 14px;
  font-weight: 400;
}

.course-details {
  padding-right: 6px;
}

.calendar-icon,
.globe-icon {
  font-size: 14px;
}

.course-body {
  padding-top: 32px;
  margin: 0px 70px;
  background-color: #fff;
  color: #303141;
  width: 700px;
}

.course-body-content {
  border: 1px solid #d1d2e0;
  margin-bottom: 32px;
  padding: 24px 0px 16px;
}

.course-objectives-show-more {
  -webkit-mask-image: linear-gradient(#ffffff, #ffffff, rgba(255, 255, 255, 0));
}

.objective-title {
  margin: 0px 24px 16px;
}

.ant-list.objectives {
  margin: 0px 24px;
}

:deep(.objectives-list.ant-list-item) {
  padding: 4px 0px !important;
  margin: 0px;
  font-size: 14px;
}

.objectives-content {
  display: flex;
  line-height: 1.2;
}

.check-icon {
  font-size: 14px;
}

.objective-item {
  display: -webkit-box !important;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin-left: 16px;
  font-size: 14px;
  font-weight: 400;
  font-family: "Udemy Sans", "SF Pro Text", "-apple-system",
    "BlinkMacSystemFont", "Roboto", "Segoe UI", Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.expand-content {
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
  margin-left: 4px;
  font-size: 10px;
  color: #6d28d2;
}

.objectives.show-less {
  max-height: var(--dynamic-maxHeight);
  overflow: hidden;
}

.objectives.show-more {
  max-height: none;
  overflow: visible;
}

.explore-container {
  margin-bottom: 32px;
}

.explore-container h2 {
  margin: 0px 0px 16px;
}

.related-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.topic {
  padding: 5px 12px;
  border: 1px solid #9194ac;
  border-radius: 4px;
  color: #303141 !important;
  background-color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 700;
  height: 34px;
}

.topic:hover {
  background-color: #f6f7f9;
}

.course-content-title {
  margin: 0px 0px 16px;
  font-weight: 700;
}

.content-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-data p {
  margin: 8px 0px !important;
  font-weight: 400;
  font-size: 14px;
}

.dot-icon {
  font-size: 10px;
}

.expand-section {
  color: #6d28d2 !important;
  font-weight: 700 !important;
  height: 40px;
}

.section-container,
.section-details {
  border: 1px solid #d1d2e0;
}

.section-container {
  border-top: none;
  border-bottom: none;
  position: relative;
}

.section-details {
  border-left: none;
  border-right: none;
  background-color: #f6f7f9;
  display: flex;
  align-items: baseline;
}

.title-arrow-icon {
  font-size: 12px;
  color: #2a2b3f;
}

.course-list {
  border-bottom: 1px solid #d1d2e0;
}

.section-title {
  margin-left: 10px;
  font-size: 16px;
  font-weight: 700;
  max-width: 74%;
  display: flex;
}

.sec-title {
  border-bottom: none !important;
}

.section-details,
.course-topics {
  padding: 16px 24px;
}

.section-duration {
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

.course-subtitle {
  color: #2a2b3f;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.is-course-preview .course-subtitle,
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

:deep(.ant-list-item .content-time) {
  color: #595c73;
  margin-left: auto;
  text-decoration: none !important;
  cursor: text !important;
}

:deep(.is-course-preview .ant-btn-link) {
  padding: 0px !important;
  height: 22px;
}

:deep(.ant-list-item .preview-btn) {
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
  margin-right: 16px;
}

.presentation-icon {
  width: 18px;
  height: 20px;
}

.desc-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d2f31 !important;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  padding: 0px 0px 0px 5px;
  margin-left: 10px;
}

.view-desc-icon {
  font-size: 25px;
  color: #f6f7f9;
  margin-right: 10px;
}

.course-btn {
  padding: 0px;
  background-color: #f6f7f9;
  height: 0px;
  border: none;
}

:deep(.description p) {
  margin: 0px 0px 0px 30px !important;
  padding-top: 8px;
  color: #595c73;
  font-size: 14px;
  font-weight: 400;
  max-width: 400px;
  position: relative;
}

:deep(.description p):hover {
  color: #595c73;
}

.show-more-btn {
  margin-top: 16px;
  width: 700px;
  height: 40px;
  color: #6d28d2 !important;
  border: 1px solid #6d28d2 !important;
  font-size: 14px;
  font-weight: 700;
}

.show-more-btn:hover {
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}
</style>
