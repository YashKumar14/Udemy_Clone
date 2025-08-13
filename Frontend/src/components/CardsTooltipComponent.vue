<template>
  <a-tooltip
    color="#fff"
    :placement="getPlacement(itemIndex)"
    :overlayInnerStyle="wrapStyles"
    :overlayStyle="{ display: 'flex' }"
  >
    <router-link to="">
      <a-col class="card1" :span="8">
        <a-card
          :style="cardStyle"
          :bordered="false"
          @mouseenter="isCardHoveredIndex = `${index}-${itemIndex}`"
          @mouseleave="isCardHoveredIndex = null"
        >
          <template #cover>
            <div class="image-container">
              <a-skeleton :loading="loading" active :paragraph="{ rows: 2 }">
                <img
                  id="image"
                  :src="course.image_240x135"
                  :style="imageStyle"
                />
              </a-skeleton>
              <div
                class="overlay"
                v-show="
                  isCardHoveredIndex === `${index}-${itemIndex}` && !loading
                "
                :style="overlayStyle"
              ></div>
            </div>
          </template>

          <div id="content">
            <a-skeleton :loading="loading" active :paragraph="{ rows: 3 }">
              <h3>{{ course.title }}</h3>
              <h4>
                {{
                  course.visible_instructors
                    .map((user) => user.title)
                    .join(", ")
                }}
              </h4>
              <h4 id="rating">
                {{ Math.round(course.rating * 10) / 10 }}
                <span>
                  <a-rate
                    class="star-rating"
                    :value="course.rating"
                    allow-half
                    disabled
                  />
                  ({{ course.num_reviews.toLocaleString() }})
                </span>
              </h4>

              <a-spin :spinning="spin" :indicator="indicator" v-if="!isToken">
                <div v-if="!isToken && !spin">
                  <b v-if="course.price">{{ course.price }}</b>
                  <b v-if="!isDiscount">{{ course.oldPrice }}</b>
                  <span id="oldPrice" v-if="isDiscount">
                    {{ course.oldPrice }}
                  </span>
                </div>
              </a-spin>

              <div class="icon" v-if="!isToken">
                <span
                  class="premium-badge"
                  v-if="course?.is_in_personal_plan_collection"
                >
                  <img
                    class="verified-icon"
                    src="/icons8-verification-64.png"
                  />
                  <span>Premium</span>
                </span>
                <span
                  id="bestseller-badge"
                  v-if="course?.bestseller_badge_content?.badge_text"
                >
                  {{ course?.bestseller_badge_content?.badge_text }}
                </span>
              </div>
            </a-skeleton>
          </div>
        </a-card>
      </a-col>
    </router-link>

    <template #title v-if="!loading">
      <router-link to="">
        <h3 id="tooltip-course-title">
          {{ course.title }}
        </h3>
      </router-link>
      <div class="icon" v-if="!isToken">
        <span
          class="premium-badge"
          v-if="course.is_in_personal_plan_collection"
        >
          <img class="verified-icon" src="/icons8-verification-64.png" />
          <span>Premium</span>
        </span>
        <span
          id="bestseller-badge"
          v-if="course?.bestseller_badge_content?.badge_text"
        >
          {{ course?.bestseller_badge_content?.badge_text }}
        </span>
      </div>
      <div id="tooltip-course-lastupdate">
        <span>Updated </span>
        {{ months[month(course.last_update_date)] }}
        {{ year(course.last_update_date) }}
      </div>
      <p id="tooltip-course-info">
        {{ course.content_info }}
        <span id="dot-icon" v-html="dotUnicode"></span>
        {{ course.instructional_level }}
        <span v-if="course.has_closed_caption">
          <span id="dot-icon" v-html="dotUnicode"></span>
          Subtitles
        </span>
        <span v-if="course.has_508_closed_captions">, CC</span>
      </p>
      <p id="tooltip-course-headline">{{ course.headline }}</p>
      <div
        id="tooltip-course-objective"
        v-for="objective in course.objectives_summary"
        :key="objective"
      >
        <CheckOutlined :style="checkStyle" />
        <span style="display: flex; margin: 0px 0px 0px 16px">
          {{ objective }}
        </span>
      </div>
      <div style="display: flex; align-items: center">
        <a-button :style="tooltipBtnStyle">
          {{ tooltipBtn }}
        </a-button>
        <PlusCircleOutlined
          v-if="isToken"
          id="plus-icon"
          :style="{ fontSize: '48px', margin: '15px 0px 0px 8px' }"
        />
        <div id="wishlist" v-if="!isToken && isLogoutPage">
          <HeartOutlined id="heart-icon" />
        </div>
      </div>
    </template>
  </a-tooltip>
</template>

<script setup>
import {
  CheckOutlined,
  HeartOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";
import { ref, watch } from "vue";
import { h } from "vue";

const { course, itemIndex, index, cardsWidth, loading, isLogoutPage } =
  defineProps({
    course: {
      type: Object,
      required: true,
    },
    itemIndex: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    cardsWidth: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    isLogoutPage: {
      type: Boolean,
      required: true,
    },
  });

const spin = ref(true);

watch(
  () => loading,
  (newLoading) => {
    if (!newLoading) {
      setTimeout(() => {
        spin.value = false;
      }, 1000);
    } else {
      spin.value = true;
    }
  }
);

const indicator = h(ReloadOutlined, {
  style: {
    fontSize: "16px",
    color: "#2f2d31",
  },
  spin: true,
});

const isToken = localStorage.getItem("authToken");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const month = (date) => {
  return new Date(date).getMonth();
};

const year = (date) => {
  return new Date(date).getFullYear();
};

const dotUnicode = "&#8226;";
const isCardHoveredIndex = ref(null);
const isDiscount = true;

const getPlacement = (index) => {
  if (index % 5 === 0 || index % 5 === 1) return "right";
  if (index % 5 === 2 || index % 5 === 3 || index % 5 === 4) return "left";
};

const wrapStyles = {
  color: "#303141",
  width: "330px",
  padding: "20px",
  lineHeight: "1.2",
  boxShadow:
    "0 0 0 1px #d1d2e0, 0 2px 4px rgba(6, 17, 118, 0.08), 0 4px 12px rgba(6, 17, 118, 0.08)",
};

const cardStyle =
  isToken || isLogoutPage
    ? {
        width: `${cardsWidth}px`,
        borderRadius: "0px",
        boxShadow: "none",
      }
    : {
        border: "1px solid #d1d7dc",
        width: `${cardsWidth}px`,
        minHeight: "350px",
      };

const imageStyle =
  isToken || isLogoutPage
    ? {
        border: "1px solid #d1d2e0",
        borderRadius: "0px",
      }
    : {
        width: "100%",
      };

const overlayStyle =
  isToken || isLogoutPage
    ? {
        position: "absolute",
        top: "1px",
        left: "1px",
        width: "240px",
        height: "135px",
        backgroundColor: "#595c73",
        opacity: "0.5",
        transition: "opacity 0.3s ease",
      }
    : {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "294px",
        height: "164px",
        backgroundColor: "#595c73",
        opacity: "0.5",
        transition: "opacity 0.3s ease",
        borderRadius: "5px",
      };

const checkStyle = {
  display: "flex",
  padding: "3px 0px 0px",
};

const tooltipBtnStyle = {
  backgroundColor: "#303141",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "700",
  width: isToken || isLogoutPage ? "80%" : "100%",
  height: "48px",
  boxShadow: "none",
  border: "none",
  margin: "15px 0px 0px",
  padding: "0px 15px",
};

const tooltipBtn = isToken ? "View Course" : "Add to cart";
</script>

<style scoped>
.image-container {
  position: relative;
}

:deep(.ant-card-body) {
  padding: 10px 0px 0px;
}

#content h3 {
  margin: 0px;
  font-weight: bold;
  font-size: 16px;
  text-wrap: wrap;
  color: #2d2f31;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

#content h4 {
  margin: 5px 0px 0px;
  font-size: 12px;
  color: #6a6f73;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

#content #rating {
  color: #2d2f31;
  font-size: 12px;
  font-weight: 700;
}

#content h4 span {
  color: #6a6f73;
  font-size: 12px;
  font-weight: 400;
}

#content h4 span .star-rating {
  color: #b4690e;
  font-size: small;
  transform: scale(0.8);
}

#oldPrice {
  margin-left: 10px;
  text-decoration: line-through;
  color: #6a6f73;
}

.icon {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.premium-badge {
  display: flex;
  background-color: #5022c3;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  line-height: 1.2;
  align-items: center;
  padding: 1px 5px;
  width: fit-content;
  border-radius: 4px;
}

#bestseller-badge {
  display: flex;
  align-items: center;
  background-color: #eceb98;
  color: #223509;
  padding: 2px 5px;
  font-weight: 700;
  font-size: 12px;
  border-radius: 4px;
}

.verified-icon {
  width: 22px;
  height: 20px;
  padding-right: 3px;
  padding-top: 0px;
}

#dot-icon {
  font-size: 10px;
}

a {
  color: #303141;
}

a:hover {
  color: #6d28d2;
}

#tooltip-course-title {
  margin: 0px;
}

#tooltip-course-lastupdate {
  font-size: 12px;
  margin: 8px 0px 0px;
  font-weight: 700;
  color: #206241;
}

#tooltip-course-lastupdate span {
  font-weight: 400;
}

#tooltip-course-headline {
  color: #303141;
  font-size: 14px;
  margin: 8px 0px;
  font-weight: 400;
}

#tooltip-course-info {
  color: #595c73;
  font-size: 12px;
  margin: 8px 0px 0px;
}

#tooltip-course-objective {
  display: flex;
  padding: 4px 0px;
  font-size: 14px;
  font-weight: 400;
}

#plus-icon:hover,
#wishlist:hover {
  background-color: #d1d7dc;
  border-radius: 100%;
  cursor: pointer;
}

#wishlist {
  width: 48px;
  height: 48px;
  border: 1px solid #2f2d31;
  border-radius: 100%;
  font-size: 48px;
  margin: 15px 0 0 8px;
}

#heart-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin: 12px;
}
</style>
