<template>
  <Notification />
  <NavigationBar :isDashboardPage="isToken" />
  <New :footerTop="footerTop" />
  <FooterBar ref="footerBar" />
</template>

<script setup>
import FooterBar from "@/components/FooterBar.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import New from "@/components/New.vue";
import { useToken } from "@/utils/useToken.js";
import Notification from "@/components/Notification.vue";
import { onMounted, onUnmounted, onUpdated, ref } from "vue";

const { token } = useToken();
const isToken = !token;

const footerBar = ref(null);
const footerTop = ref(0);

const calculateFooterPosition = () => {
  if (footerBar.value?.footerRoot) {
    footerTop.value =
      footerBar.value.footerRoot.getBoundingClientRect().top + window.scrollY;
    console.log("footerTop", footerTop.value);
  } else {
    console.warn("footerBar is not available");
  }
};

onMounted(() => {
  calculateFooterPosition();
  window.addEventListener("scroll", calculateFooterPosition);
});

onUnmounted(() => {
  window.removeEventListener("scroll", calculateFooterPosition);
});
</script>
