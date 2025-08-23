<template>
  <Notification @closedNotification="NotificationLabel" />
  <NavigationBar
    :isDashboardPage="false"
    :isNotificationVisible="isNotificationVisible"
  />
  <BannerSlide :isLogoutPage="false" />
  <Logos />
  <Learning />
  <Reports />
  <Trending />
  <Suspense>
    <CoursesCards :isLogoutPage="false" />
  </Suspense>
  <FocusedGoals />
  <CaseStudies />
  <FooterBar />
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import Logos from "@/components/Logos.vue";
import Reports from "@/components/Reports.vue";
import Trending from "@/components/Trending.vue";
import Learning from "@/components/Learning.vue";
import CoursesCards from "@/components/CoursesCards.vue";
import Notification from "@/components/Notification.vue";
import BannerSlide from "@/components/BannerSlide.vue";
import FocusedGoals from "@/components/FocusedGoals.vue";
import CaseStudies from "@/components/CaseStudies.vue";
import { ref } from "vue";

const isNotificationVisible = ref(true);

const NotificationLabel = (value) => {
  console.log("NotificationLabel closed", value);
  isNotificationVisible.value = value;
};
</script>
