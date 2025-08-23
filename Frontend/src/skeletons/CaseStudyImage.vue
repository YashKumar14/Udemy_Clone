<template>
  <div class="image-skeleton-loader" :style="wrapStyle">
    <a-image
      v-if="isLogo"
      class="logo-img"
      src="/short-logo-udemy.svg"
      width="80px"
      height="80px"
      :preview="false"
    />
  </div>
</template>

<script setup>
const { isCaseStudyPage, isLogo } = defineProps({
  isCaseStudyPage: {
    type: Boolean,
    required: true,
  },
  isLogo: {
    type: Boolean,
    required: false,
  },
});

const wrapStyle = {
  width: isCaseStudyPage ? "600px" : isLogo ? "1600px" : "80px",
  height: isCaseStudyPage ? "500px" : isLogo ? "500px" : "80px",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0px 0px 5px",
};
</script>

<style>
@keyframes skeleton-animation {
  0% {
    transform: translateX(-37.5%);
  }

  100% {
    transform: translateX(37.5%);
  }
}

.image-skeleton-loader::before {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  right: -150%;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.15) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  animation: skeleton-animation 1.4s infinite ease;
}

.logo-img {
  fill: #fff;
  filter: invert(1) grayscale(100%);
}
</style>
