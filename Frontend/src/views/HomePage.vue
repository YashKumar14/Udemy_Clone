<template>
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
</template>

<script setup>
import Logos from "@/components/Logos.vue";
import Reports from "@/components/Reports.vue";
import Trending from "@/components/Trending.vue";
import Learning from "@/components/Learning.vue";
import CoursesCards from "@/components/CoursesCards.vue";
import BannerSlide from "@/components/BannerSlide.vue";
import FocusedGoals from "@/components/FocusedGoals.vue";
import CaseStudies from "@/components/CaseStudies.vue";
</script>
