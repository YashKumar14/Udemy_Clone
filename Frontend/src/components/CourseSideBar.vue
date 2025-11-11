<template>
  <div class="course-sidebar">
    <div class="overlay">
      <!-- course preview image -->
      <div
        class="course-preview"
        v-if="!loading && destructuredData.image_480x270"
      >
        <a-image
          class="preview-image"
          :src="destructuredData.image_480x270"
          alt="img"
          :preview="false"
        />

        <div class="image-overlay" v-if="destructuredData.image_480x270">
          <PlayCircleFilled class="play-circle-icon" />

          <p>Preview this course</p>
        </div>
      </div>

      <a-skeleton
        :paragraph="{ rows: 4 }"
        class="side-bar-skeleton-loader"
        v-if="loading"
      />
    </div>

    <!-- course content -->
    <div
      class="overlay-content"
      :class="{
        sticky: isSticky,
      }"
      ref="courseOverlay"
    >
      <a-skeleton
        :paragraph="{ rows: 9 }"
        class="side-bar-skeleton-loader"
        v-if="loading"
      />

      <div class="course-overlay" v-if="!loading">
        <!-- plan buttons -->
        <div
          class="plan-btns"
          v-if="destructuredCourseData.is_in_personal_plan_collection"
        >
          <a-button
            type="text"
            size="large"
            :class="{
              [`${btnName}-active`]: selectedBtn === title,
              [`${btnName}`]: true,
            }"
            @click="selectButton(title)"
            v-for="{ btnName, title } in buttons.slice(0, 2)"
            :key="btnName"
          >
            {{ title }}
          </a-button>
        </div>

        <!-- Personal Plan -->
        <div class="btns-content" v-if="selectedBtn === 'Personal'">
          <div
            class="premium-details"
            v-if="destructuredCourseData.is_in_personal_plan_collection"
          >
            <a-image
              class="verified-icon"
              src="/icons8-verified-green-32.png"
              :preview="false"
            />

            <p>This Premium course is included in plans</p>
          </div>

          <!-- Subscription content if no discount applied -->
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
              v-if="destructuredData"
            />

            <a-divider class="divider"> or </a-divider>
          </div>

          <!-- Discount Details -->
          <div class="discount-details">
            <!-- Discount Price -->
            <h2
              class="discount-price"
              v-if="destructuredCourseData.discount_price"
            >
              {{ destructuredCourseData.discount_price }}
            </h2>

            <!-- Actual Price -->
            <h2
              :class="
                destructuredCourseData.discount_percent
                  ? 'striked-price'
                  : 'course-price'
              "
            >
              {{ destructuredCourseData.actual_price }}
            </h2>

            <!-- Discount Percentage -->
            <p
              class="discount-percent"
              v-if="destructuredCourseData.discount_percent"
            >
              {{ destructuredCourseData.discount_percent }}% off
            </p>
          </div>

          <!-- Discount Period -->
          <div class="discount-time" v-if="destructuredData.discountEnabled">
            <ClockCircleOutlined class="clock-icon" />

            <span class="timer-left">
              {{ destructuredData.discount_deadline_text }}
            </span>

            left at this price!
          </div>

          <!-- Add to cart and Buy Buttons -->
          <a-button
            type="link"
            href="#"
            :class="[
              {
                'discount-applied':
                  destructuredData.discountEnabled && title === 'Add to cart',
              },
              `${btnName}`,
            ]"
            v-for="{ btnName, title } in buttons.slice(2, 4)"
            :key="btnName"
          >
            {{ title }}
          </a-button>

          <!-- Lifetime Access and Money Back guarantee details -->
          <div class="content-div">
            <p class="money-back" v-if="destructuredData.isMoneyBackEnabled">
              30-Day Money-Back Guarantee
            </p>

            <p
              class="lifetime-access"
              v-if="
                destructuredData.hasLifetimeAccess &&
                destructuredCourseData.is_in_personal_plan_collection
              "
            >
              Full Lifetime Access
            </p>
          </div>

          <!-- Course Incentives -->
          <CourseIncentives
            :data="destructuredData"
            :isCourseSidebar="true"
            v-if="!destructuredCourseData.is_in_personal_plan_collection"
          />

          <!-- Coupons Buttons -->
          <div class="buttons">
            <a-button
              type="link"
              href="#"
              class="feature-btns"
              v-for="{ btnName, title } in buttons.slice(4, 7)"
              :key="btnName"
            >
              {{ title }}
            </a-button>
          </div>

          <!-- Coupon Details -->
          <div class="coupon-container" v-if="isUdemyCouponVisible">
            <div class="coupon-details">
              <span class="coupon-code">
                {{ couponCode }}
              </span>
              is applied

              <p>Udemy coupon</p>
            </div>

            <CloseOutlined class="close-icon" @click="removeUdemyCoupon" />
          </div>

          <!-- Apply Coupon Form -->
          <a-form
            layout="inline"
            :model="formState"
            @finish="handleFinish"
            @finishFailed="handleFinishFailed"
            class="coupon-form"
          >
            <a-form-item>
              <a-input
                v-model:value="formState.coupon"
                placeholder="Enter Coupon"
                class="coupon-input-field"
              >
              </a-input>
            </a-form-item>

            <!-- Apply Coupon Button -->
            <a-form-item>
              <a-button type="primary" html-type="submit" class="apply-btn">
                Apply
              </a-button>
            </a-form-item>
          </a-form>

          <!-- Subscription content if Discount Applied -->
          <div
            v-if="
              destructuredData?.discountEnabled &&
              destructuredCourseData?.is_in_personal_plan_collection
            "
          >
            <a-divider class="divider"> or </a-divider>

            <SubscriptionContent
              v-if="
                destructuredData &&
                destructuredData?.description &&
                destructuredData?.discountEnabled !== undefined
              "
              :subscriptionContent="destructuredData?.description"
              :isDiscount="destructuredData?.discountEnabled"
            />
          </div>
        </div>

        <!-- Non Premium -->
        <div
          class="non-premium-content"
          v-if="!destructuredCourseData.is_in_personal_plan_collection"
        >
          <h2 class="content-title">{{ destructuredData.title }}</h2>

          <p class="content-text">{{ destructuredData.content }}</p>

          <!-- Try Business Button -->
          <a-button type="link" href="#" size="large" class="try-btn">
            {{ destructuredData.ufb_button_copy }}
          </a-button>
        </div>

        <!-- Teams Plan -->
        <div class="btns-content" v-if="selectedBtn === 'Teams'">
          <div
            class="premium-details"
            v-if="destructuredCourseData.is_in_personal_plan_collection"
          >
            <a-image
              class="verified-icon"
              src="/icons8-verified-green-32.png"
              :preview="false"
            />

            <p>This Premium course is included in plans</p>
          </div>

          <a-image class="logo-ub" src="/logo_ub.svg" :preview="false" />

          <p class="teams-subscription">
            Subscribe to this course and 27,000+ top‑rated Udemy courses for
            your organization.
          </p>

          <!-- Business Button -->
          <a-button type="link" href="#" size="large" class="business-btn">
            {{ buttons.find((btn) => btn.btnName === "business-btn")?.title }}
          </a-button>

          <!-- Teams Features -->
          <div class="teams-features">
            <p
              class="features-content"
              v-for="(features, index) in teamsFeatures.team_features"
              :key="index"
            >
              <CheckOutlined class="check-icon" />
              {{ features }}
            </p>
          </div>
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

const {
  individualCourseData,
  footerTop,
  courseBodyTop,
  sliderMenuBottom,
  courseId,
  loading,
} = defineProps({
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
  courseId: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const isUdemyCouponVisible = ref(true);
const couponCode = ref("");
const data = ref([]);

const fetchCourseDetails = async () => {
  try {
    const response = await axios.get(
      `https://www.udemy.com/api-2.0/course-landing-components/${courseId}/me/`,
      {
        params: queryParams,
      }
    );

    data.value = response.data;
    // console.log(data.value);

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

const destructuredData = computed(() => {
  const courseData = data.value || {};

  const {
    incentives = {},
    buy_for_team: { data: buyForTeam = {} } = {},
    sidebar_container: { componentProps: sidebarProps = {} } = {},
    discount_expiration: { data: discountData = {} } = {},
  } = courseData;

  return {
    // redeem_coupon
    discount_attempts: courseData.redeem_coupon?.discount_attempts ?? 0,

    // incentives
    video_content_length: incentives.video_content_length ?? 0,
    audio_content_length: incentives.audio_content_length ?? 0,
    num_coding_exercises: incentives.num_coding_exercises ?? 0,
    num_practice_tests: incentives.num_practice_tests ?? 0,
    has_assignments: incentives.has_assignments ?? false,
    num_articles: incentives.num_articles ?? 0,
    num_additional_resources: incentives.num_additional_resources ?? 0,
    has_lifetime_access: incentives.has_lifetime_access ?? false,
    devices_access: incentives.devices_access ?? [],
    has_certificate: incentives.has_certificate ?? false,
    has_closed_captions: incentives.has_closed_captions ?? false,

    // buy_for_team
    title: buyForTeam.ufb_copy_context?.title ?? "",
    content: buyForTeam.ufb_copy_context?.content ?? "",
    ufb_button_copy: buyForTeam.ufb_button_copy ?? "",

    // sidebar_container
    image_480x270: sidebarProps.introductionAsset?.images?.image_480x270 ?? "",
    description:
      sidebarProps.purchaseSection?.subscriptionContext?.description ?? "",
    isMoneyBackEnabled: sidebarProps.moneyBackGuarantee?.is_enabled ?? false,

    // discount_expiration
    discount_deadline_text: discountData.discount_deadline_text ?? "",
    discountEnabled: discountData.is_enabled ?? false,

    // lifetime_access_context
    hasLifetimeAccess:
      courseData.lifetime_access_context?.hasLifetimeAccess ?? false,

    // curriculum_context
    curriculum_data: courseData.curriculum_context?.data ?? [],
  };
});

console.log({ destructuredData });

const destructuredCourseData = computed(() => {
  const data = individualCourseData || {};

  const is_in_personal_plan_collection =
    data.is_in_personal_plan_collection ?? false;

  const discount = data.discount ?? {};
  const discount_price = discount?.price?.price_string || null;
  const actual_price =
    discount?.list_price?.price_string ||
    data?.price_detail?.price_string ||
    null;
  const discount_percent = discount?.discount_percent_for_display || null;

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
    // console.log({ newValue });
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
    btnName: "add-cart-btn",
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
  // console.log("isAboveSliderMenu", isAboveSliderMenu);

  const isFooterInViewport = footerTop < window.scrollY + window.innerHeight;
  // console.log("isFooterInViewport", isFooterInViewport);

  isSticky.value = isAboveSliderMenu && !isFooterInViewport;
  // console.log("isSticky", isSticky.value);
};

onMounted(() => {
  fetchCourseDetails();

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
.course-sidebar {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 55px;
  left: 65%;
}

.overlay-content.sticky {
  position: sticky;
  top: 0px;
  border: 1px solid red;
}

.overlay {
  display: flex;
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
  width: 340px;
  background-color: #fff;
  color: #303141;
  z-index: 150;
  box-shadow: 0 2px 4px rgba(6, 17, 118, 0.08),
    0 4px 12px rgba(6, 17, 118, 0.08);
}

.course-preview .image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(12, 12, 12, 0.5);
  border: 1px solid #d1d2e0;
  color: #fff;
  width: 99.5%;
  height: 190px;
}

.course-preview :hover {
  cursor: pointer;
}

:deep(.ant-image-img.preview-image) {
  vertical-align: unset;
}

.image-overlay p {
  position: absolute;
  top: 135px;
  left: 32%;
  font-size: 16px;
  font-weight: 700;
}

.play-circle-icon {
  position: absolute;
  top: 60px;
  right: 40%;
  color: #fff;
  border-radius: 100%;
  background-color: #1d1e27;
  font-size: 60px;
}

.plan-btns {
  margin: 0px 3px;
  border-bottom: 1px solid #d1d2e0;
}

.plan-btns :hover {
  background-color: #fff;
  color: #303141;
}

.personal-btn-active,
.teams-btn-active {
  border-bottom: 1px solid #303141;
  color: #303141 !important;
}

.personal-btn,
.teams-btn {
  padding: 0px 20px;
  width: 165px;
  font-weight: 700;
  color: #595c73;
  border-radius: 0px;
}

.btns-content,
.non-premium-content,
.side-bar-skeleton-loader {
  padding: 16px 24px 24px;
}

.premium-details {
  display: flex;
  margin-bottom: 8px;
}

.premium-details p {
  font-size: 14px;
  font-weight: 400;
  margin: 0px;
}

:deep(.ant-image-img.verified-icon) {
  width: 16px;
  height: 16px;
  margin: 0px 8px 0px -2px;
  filter: invert(100%);
  vertical-align: top;
}

.add-cart-btn,
.buy-btn,
.try-btn,
.business-btn {
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 0px;
  height: 48px;
}

.divider {
  color: #595c73;
  font-size: 12px;
  margin: 16px 0px;
  border-color: #595c73;
}

.discount-details {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0px;
}

.discount-price,
.course-price,
.striked-price,
.discount-percent {
  margin: 0px;
}

.striked-price {
  font-size: 16px;
  text-decoration: line-through;
  color: #595c73;
  font-weight: 400;
}

.business-btn,
.discount-applied {
  color: #fff !important;
  background-color: #6d28d2;
}

.discount-time {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #d51c0f;
  margin: 5px 0px 8px;
}

.clock-icon {
  font-size: 12px;
}

.timer-left {
  padding: 0px 5px;
  font-weight: 700;
}

.business-btn:hover,
.discount-applied:hover,
.apply-btn:hover {
  background-color: #892de1 !important;
}

.add-cart-btn,
.buy-btn,
.try-btn {
  color: #6d28d2;
  border-color: #6d28d2;
  margin-top: 10px;
}

.add-cart-btn:hover,
.buy-btn:hover,
.try-btn:hover {
  background-color: #d1d2e0;
  color: #6d28d2;
}

.content-div {
  margin-top: 16px;
}

.money-back,
.lifetime-access {
  font-size: 12px;
  font-weight: 400;
  margin: 8px 0px 0px;
  text-align: center;
}

.buttons {
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

.coupon-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px dashed #9194ac;
  margin-top: 8px;
}

.coupon-details {
  color: #9194ac;
  font-size: 14px;
  font-weight: 400;
  padding-left: 8px;
}

.coupon-code {
  font-weight: 700;
}

.coupon-details p {
  margin: 0px;
  font-size: 12px;
}

.close-icon {
  display: flex;
  align-items: center;
  color: #6d28d2;
  justify-content: center;
  padding: 0px 10px;
  height: 48px;
}

.close-icon:hover {
  cursor: pointer;
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}

.coupon-form {
  padding-top: 8px;
  flex-wrap: nowrap;
}

.coupon-input-field {
  border: 1px solid #9194ac;
  height: 40px;
  width: 205px;
}

.coupon-input-field:hover {
  background-color: #f6f7f9;
}

:deep(.ant-input:focus) {
  box-shadow: none;
}

:deep(.ant-input::placeholder) {
  color: #303141;
}

.apply-btn {
  background-color: #6d28d2;
  font-size: 14px;
  font-weight: 700;
  height: 40px;
}

.non-premium-content {
  border-top: 1px solid #d1d2e0;
}

.content-title {
  font-size: 18px;
  margin: 0px 0px 8px;
}

.content-text {
  font-size: 14px;
  margin: 0px;
}

:deep(.ant-image-img.logo-ub) {
  width: 141px;
  height: 24px;
  margin: 8px 0px;
}

.teams-subscription {
  font-size: 16px;
  font-weight: 400;
  margin: 0px 0px 16px;
}

.teams-features {
  margin-top: 20px;
}

.features-content {
  padding: 8px 0px;
  margin: 0px;
  font-size: 14px;
  font-weight: 400;
}

.check-icon {
  font-size: 12px;
  margin-right: 16px;
}
</style>
