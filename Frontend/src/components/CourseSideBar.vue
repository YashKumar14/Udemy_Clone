<template>
  <div class="overlay">
    <div class="course-preview">
      <div class="image-container">
        <img
          class="preview-image"
          :src="destructuredData.image_480x270"
          alt="img"
        />
        <div class="image-overlay" v-if="destructuredData.image_480x270">
          <PlayCircleFilled class="play-circle-icon" />
          <p>Preview this course</p>
        </div>
      </div>
    </div>
  </div>

  <div
    class="overlay-content"
    :class="{
      sticky: isSticky,
    }"
    ref="courseOverlay"
  >
    <div v-if="loading">
      <a-skeleton :paragraph="{ rows: 9 }" id="skeleton-loader" />
    </div>
    <div class="course-overlay" v-if="!loading">
      <div
        id="btns"
        v-if="destructuredCourseData.is_in_personal_plan_collection"
      >
        <a-button
          type="text"
          size="large"
          :id="btnName"
          :class="{ [`${btnName}-active`]: selectedBtn === title }"
          @click="selectButton(title)"
          v-for="{ btnName, title } in buttons.slice(0, 2)"
          :key="btnName"
        >
          {{ title }}
        </a-button>
      </div>

      <div id="btns-content" v-if="selectedBtn === 'Personal'">
        <div
          id="premium-details"
          v-if="destructuredCourseData.is_in_personal_plan_collection"
        >
          <img class="verified-icon" src="/icons8-verified-green-32.png" />
          <p>This Premium course is included in plans</p>
        </div>

        <div
          v-if="
            !destructuredData.discountEnabled &&
            destructuredData.description &&
            destructuredData.discountEnabled !== undefined
          "
        >
          <SubscriptionContent
            :subscriptionContent="destructuredData.description"
            :isDiscount="destructuredData.discountEnabled"
          />
          <a-divider id="divider"> or </a-divider>
        </div>

        <div>
          <div id="discount-details">
            <h2
              id="discount-price"
              v-if="destructuredCourseData.discount_price"
            >
              {{ destructuredCourseData.discount_price }}
            </h2>

            <h2
              :class="
                destructuredCourseData.discount_percent
                  ? 'striked-price'
                  : 'course-price'
              "
            >
              {{ destructuredCourseData.actual_price }}
            </h2>

            <p
              id="discount-percent"
              v-if="destructuredCourseData.discount_percent"
            >
              {{ destructuredCourseData.discount_percent }}% off
            </p>
          </div>

          <div id="discount-time" v-if="destructuredData.discountEnabled">
            <ClockCircleOutlined id="clock-icon" />
            <span id="timer-left">
              {{ destructuredData.discount_deadline_text }}
            </span>
            left at this price!
          </div>

          <a-button
            type="link"
            href="#"
            :id="`${btnName}`"
            :class="{
              'discount-applied':
                destructuredData.discountEnabled && title === 'Add to cart',
            }"
            v-for="{ btnName, title } in buttons.slice(2, 4)"
            :key="btnName"
          >
            {{ title }}
          </a-button>

          <div id="content-div">
            <p id="money-back" v-if="destructuredData.isMoneyBackEnabled">
              30-Day Money-Back Guarantee
            </p>

            <p
              id="lifetime-access"
              v-if="
                destructuredData.hasLifetimeAccess &&
                destructuredCourseData.is_in_personal_plan_collection
              "
            >
              Full Lifetime Access
            </p>
          </div>

          <CourseIncentives
            :data="destructuredData"
            :isCourseSidebar="true"
            v-if="!destructuredCourseData.is_in_personal_plan_collection"
          />
          <div id="buttons">
            <a-button
              type="link"
              href="#"
              :id="`${btnName}`"
              class="feature-btns"
              v-for="{ btnName, title } in buttons.slice(4, 7)"
              :key="btnName"
            >
              {{ title }}
            </a-button>
          </div>

          <div id="coupon-container" v-if="isUdemyCouponVisible">
            <div id="coupon-details">
              <span id="coupon-code">
                {{ couponCode }}
              </span>
              is applied
              <p>Udemy coupon</p>
            </div>

            <CloseOutlined id="close-icon" @:click="removeUdemyCoupon" />
          </div>

          <div id="coupon-div">
            <a-form
              layout="inline"
              :model="formState"
              @finish="handleFinish"
              @finishFailed="handleFinishFailed"
              id="coupon-form"
              style="flex-wrap: nowrap"
            >
              <a-form-item>
                <a-input
                  v-model:value="formState.coupon"
                  placeholder="Enter Coupon"
                  id="coupon-input-field"
                >
                </a-input>
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit" id="apply-btn">
                  Apply
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <div
            v-if="
              destructuredData.discountEnabled &&
              destructuredCourseData.is_in_personal_plan_collection
            "
          >
            <a-divider id="divider"> or </a-divider>

            <SubscriptionContent
              v-if="
                destructuredData.description &&
                destructuredData.discountEnabled !== undefined
              "
              :subscriptionContent="destructuredData.description"
              :isDiscount="destructuredData.discountEnabled"
            />
          </div>
        </div>
      </div>

      <div
        id="non-premium-content"
        v-if="!destructuredCourseData.is_in_personal_plan_collection"
      >
        <h2 id="content-title">
          {{ destructuredData.title }}
        </h2>
        <p id="content-text">{{ destructuredData.content }}</p>
        <a-button type="link" href="#" size="large" id="try-btn">
          {{ destructuredData.ufb_button_copy }}
        </a-button>
      </div>

      <div id="btns-content" v-if="selectedBtn === 'Teams'">
        <div
          id="premium-details"
          v-if="destructuredCourseData.is_in_personal_plan_collection"
        >
          <img class="verified-icon" src="/icons8-verified-green-32.png" />
          <p>This Premium course is included in plans</p>
        </div>

        <img
          id="logo"
          src="https://www.udemy.com/staticx/udemy/images/v7/logo-ub.svg"
        />

        <p id="teams-subscription">
          Subscribe to this course and 27,000+ top‑rated Udemy courses for your
          organization.
        </p>

        <a-button type="link" href="#" size="large" id="business-btn">
          {{ buttons.find((btn) => btn.btnName === "business-btn")?.title }}
        </a-button>

        <div id="teams-features">
          <p
            id="features-content"
            v-for="(features, index) in teamsFeatures.team_features"
            :key="index"
          >
            <CheckOutlined id="check-icon" />
            {{ features }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  PlayCircleFilled,
} from "@ant-design/icons-vue";
import SubscriptionContent from "./SubscriptionContent.vue";
import CourseIncentives from "./CourseIncentives.vue";

// const individualCourseData = ref("");

const { individualCourseData, footerTop, courseBodyTop, sliderMenuBottom } =
  defineProps({
    individualCourseData: {
      type: Object,
      required: true,
    },
    footerTop: {
      type: Number,
      required: true,
    },
    courseBodyTop: {
      type: Number,
      required: true,
    },
    sliderMenuBottom: {
      type: Number,
      required: true,
    },
  });

const courseId = ref(localStorage.getItem("setSelectedCourseId"));
const isUdemyCouponVisible = ref(true);
const couponCode = ref("");
const data = ref([]);
const loading = ref(true);

const destructuredData = computed(() => {
  const {
    redeem_coupon: { discount_attempts } = {},
    incentives: {
      video_content_length,
      audio_content_length,
      num_coding_exercises,
      num_practice_tests,
      has_assignments,
      num_articles,
      num_additional_resources,
      has_lifetime_access,
      devices_access,
      has_certificate,
      has_closed_captions,
    } = {},
    buy_for_team: {
      data: { ufb_copy_context: { title, content } = {}, ufb_button_copy } = {},
    } = {},
    sidebar_container: {
      componentProps: {
        introductionAsset: { images: { image_480x270 } = {} } = {},
        purchaseSection: { subscriptionContext: { description } = {} } = {},
        moneyBackGuarantee: { is_enabled: isMoneyBackEnabled } = {},
      } = {},
    } = {},
    discount_expiration: {
      data: { discount_deadline_text, is_enabled: discountEnabled } = {},
    } = {},
    lifetime_access_context: { hasLifetimeAccess } = {},
    curriculum_context: { data: curriculum_data } = {},
  } = data.value;

  return {
    description,
    image_480x270,
    isMoneyBackEnabled,
    discount_deadline_text,
    discountEnabled,
    hasLifetimeAccess,
    discount_attempts,
    title,
    content,
    ufb_button_copy,
    video_content_length,
    num_articles,
    num_additional_resources,
    has_lifetime_access,
    devices_access,
    has_certificate,
    has_closed_captions,
    num_coding_exercises,
    num_practice_tests,
    has_assignments,
    audio_content_length,
    curriculum_data,
  };
});

const destructuredCourseData = computed(() => {
  const {
    is_in_personal_plan_collection = {},
    discount: {
      price: { price_string: discount_price } = {},
      list_price: { price_string: actual_price } = {},
      discount_percent_for_display: discount_percent = {},
    } = {},
  } = individualCourseData;

  return {
    is_in_personal_plan_collection,
    discount_price,
    actual_price,
    discount_percent,
  };
});

const emit = defineEmits(["courseData"]);

watch(
  destructuredData,
  (newValue) => {
    emit("courseData", newValue);
  },
  { immediate: true, deep: true }
);

const buttons = [
  {
    btnName: "personal-btn",
    title: "Personal",
  },
  {
    btnName: "teams-btn",
    title: "Teams",
  },
  {
    btnName: "addCart-btn",
    title: "Add to cart",
  },
  {
    btnName: "buy-btn",
    title: "Buy now",
  },
  {
    btnName: "share-btn",
    title: "Share",
  },
  {
    btnName: "gift-btn",
    title: "Gift this course",
  },
  {
    btnName: "coupon-btn",
    title: "Apply Coupon",
  },
  {
    btnName: "business-btn",
    title: "Try Udemy Business",
  },
];

const teamsFeatures = {
  team_features: [
    "For teams of 2 or more users",
    "27,000+ fresh & in-demand courses",
    "Learning Engagement tools",
    "SSO and LMS Integrations",
  ],
};

const queryParams = {
  couponCode: "24T3MT270225",
  components: [
    "add_to_cart",
    "available_coupons",
    "base_purchase_section",
    "buy_button",
    "buy_for_team",
    "cacheable_buy_button",
    "cacheable_deal_badge",
    "cacheable_discount_expiration",
    "cacheable_price_text",
    "cacheable_purchase_text",
    "curated_for_ufb_notice_context",
    "curriculum_context",
    "deal_badge",
    "discount_expiration",
    "gift_this_course",
    "incentives",
    "instructor_links",
    "lifetime_access_context",
    "money_back_guarantee",
    "price_text",
    "purchase_tabs_context",
    "purchase",
    "recommendation",
    "redeem_coupon",
    "sidebar_container",
    "purchase_body_container",
    "one_click_checkout",
  ].join(","),
};

const selectedBtn = ref(buttons[0].title);

const fetchCourseDetails = async () => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/course-landing-components/${courseId.value}/me/`,
      {
        params: queryParams,
      }
    );

    data.value = response.data;
    console.log(data.value);

    const arr = data.value.redeem_coupon.discount_attempts;

    arr.map((coupon) => {
      if (coupon.status === "applied") {
        console.log("code:::", coupon.code);
        couponCode.value = coupon.code;
      }
    });
  } catch (error) {
    console.error("Error while fetching courses api:", error);
  }
};

const selectButton = (title) => {
  selectedBtn.value = title;
};

const removeUdemyCoupon = () => {
  isUdemyCouponVisible.value = false;
};

const formState = reactive({
  coupon: "",
});

const handleFinish = (values) => {
  console.log(values, formState);
};

const handleFinishFailed = (errors) => {
  console.log(errors);
};

const courseOverlay = ref(null);

const isSticky = ref(false);

const updateStickyStatus = () => {
  const isAboveSliderMenu = courseBodyTop <= sliderMenuBottom;
  console.log("isAboveSliderMenu", isAboveSliderMenu);

  const isFooterInViewport = footerTop < window.scrollY + window.innerHeight;
  console.log("isFooterInViewport", isFooterInViewport);

  isSticky.value = isAboveSliderMenu && !isFooterInViewport;
  console.log("isSticky", isSticky.value);
};

onMounted(() => {
  fetchCourseDetails();

  setTimeout(() => {
    loading.value = false;
  }, 2000);

  updateStickyStatus();
  window.addEventListener("scroll", updateStickyStatus);
  window.addEventListener("resize", updateStickyStatus);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateStickyStatus);
  window.removeEventListener("resize", updateStickyStatus);
});
</script>

<style scoped>
.overlay-content.sticky {
  position: sticky;
  top: 0px;
  border: 1px solid red;
}

.overlay {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 55px;
  left: 65%;
  width: 340px;
  background-color: #fff;
  color: #303141;
  z-index: 90;
  box-shadow: 0 2px 4px rgba(6, 17, 118, 0.08),
    0 4px 12px rgba(6, 17, 118, 0.08);
}

.overlay-content {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 62%;
  left: 65%;
  width: 340px;
  background-color: #fff;
  color: #303141;
  z-index: 150;
  box-shadow: 0 2px 4px rgba(6, 17, 118, 0.08),
    0 4px 12px rgba(6, 17, 118, 0.08);
}

.course-preview .image-overlay {
  position: absolute;
  background-color: rgba(12, 12, 12, 0.5);
  color: #fff;
  top: 0;
  left: 0;
  width: 99%;
  height: 98%;
}

.course-preview :hover {
  cursor: pointer;
}

.preview-image {
  width: 100%;
}

.image-container {
  position: relative;
}

.image-overlay {
  border: 1px solid #d1d2e0;
}

.image-overlay p {
  position: absolute;
  top: 120px;
  left: 32%;
  font-size: 16px;
  font-weight: 700;
}

.play-circle-icon {
  position: absolute;
  top: 30%;
  right: 40%;
  color: #fff;
  border-radius: 100%;
  background-color: #1d1e27;
  font-size: 60px;
}

#btns {
  margin: 0px 3px;
  border-bottom: 1px solid #d1d2e0;
}

#btns :hover {
  background-color: #fff;
  color: #303141;
}

.personal-btn-active,
.teams-btn-active {
  border-bottom: 1px solid #303141;
  color: #303141 !important;
}

#personal-btn,
#teams-btn {
  padding: 0px 20px;
  width: 165px;
  font-weight: 700;
  color: #595c73;
  border-radius: 0px;
}

#btns-content,
#non-premium-content,
#skeleton-loader {
  padding: 16px 24px 24px;
}

#premium-details {
  display: flex;
  margin: 0px 0px 8px;
}

#premium-details p {
  font-size: 14px;
  font-weight: 400;
  margin: 0px;
}

.verified-icon {
  width: 16px;
  height: 16px;
  padding-right: 8px;
  padding-top: 0px;
  filter: invert(100%);
}

#addCart-btn,
#buy-btn,
#try-btn,
#business-btn {
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 0px;
  height: 48px;
}

#divider {
  color: #595c73;
  font-size: 12px;
  margin: 16px 0px;
  border-color: #595c73;
}

#discount-details {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0px;
}

#discount-price,
.course-price,
.striked-price,
#discount-percent {
  margin: 0px;
}

.striked-price {
  font-size: 16px;
  text-decoration: line-through;
  color: #595c73;
  font-weight: 400;
}

#business-btn,
.discount-applied {
  color: #fff !important;
  background-color: #6d28d2;
}

#discount-time {
  font-size: 14px;
  color: #d51c0f;
  margin: 5px 0px 8px;
}

#clock-icon {
  font-size: 12px;
}

#timer-left {
  padding: 0px 0px 0px 5px;
  font-weight: 700;
}

#business-btn:hover,
.discount-applied:hover {
  background-color: #892de1 !important;
}

#addCart-btn,
#buy-btn,
#try-btn {
  color: #6d28d2;
  border-color: #6d28d2;
  margin: 10px 0px 0px;
}

#addCart-btn:hover,
#buy-btn:hover,
#try-btn:hover {
  background-color: #d1d2e0;
}

#content-div {
  margin: 16px 0px 0px;
}

#money-back,
#lifetime-access {
  font-size: 12px;
  font-weight: 400;
  margin: 8px 0px 0px;
  text-align: center;
}

#buttons {
  display: flex;
  justify-content: space-between;
}

.feature-btns {
  display: flex;
  align-items: center;
  border: none;
  box-shadow: none;
  font-size: 14px;
  height: 40px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: #af72fd;
  padding: 0px 3px;
  margin: 2px 0px;
  color: #303141;
}

.feature-btns:hover {
  background-color: #eeeffc;
  color: #303141;
  height: 40px;
}

#course-incentives {
  padding: 24px 0px 0px;
}

#incentive-title {
  margin: 0px 0px 8px;
  font-size: 16px;
}

.incentives-list {
  padding: 4px 0px;
}

.icons {
  font-size: 14px;
}

.incentive-content {
  margin: 0px 0px 0px 16px;
}

#coupon-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px dashed #9194ac;
  margin: 8px 0px 0px;
}

#coupon-details {
  color: #9194ac;
  font-size: 14px;
  font-weight: 400;
  padding: 0px 0px 0px 8px;
}

#coupon-code {
  font-weight: 700;
}

#coupon-details p {
  margin: 0px;
  font-size: 12px;
}

#close-icon {
  display: flex;
  align-items: center;
  color: #6d28d2;
  justify-content: center;
  padding: 0px 10px;
  height: 48px;
}

#close-icon:hover {
  cursor: pointer;
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}

#coupon-form {
  padding: 8px 0px 0px;
}

#coupon-input-field {
  border: 1px solid #9194ac;
  height: 40px;
  width: 205px;
}

#coupon-input-field:hover {
  background-color: #f6f7f9;
}

:deep(.ant-input:focus) {
  box-shadow: none;
}

:deep(.ant-input::placeholder) {
  color: #303141;
}

#apply-btn {
  background-color: #6d28d2;
  font-size: 14px;
  font-weight: 700;
  height: 40px;
}

#non-premium-content {
  border-top: 1px solid #d1d2e0;
}

#content-title {
  font-size: 18px;
  margin: 0px 0px 8px;
}

#content-text {
  font-size: 14px;
  margin: 0px;
}

#logo {
  width: 141px;
  height: 24px;
  margin: 8px 0px;
}

#teams-subscription {
  font-size: 16px;
  font-weight: 400;
  margin: 0px 0px 16px;
}

#teams-features {
  margin: 20px 0px 0px;
}

#features-content {
  padding: 8px 0px;
  margin: 0px;
  font-size: 14px;
  font-weight: 400;
}

#check-icon {
  font-size: 12px;
  margin: 0px 16px 0px 0px;
}
</style>
