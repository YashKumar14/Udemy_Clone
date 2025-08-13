<template>
  <NavigationBar :isDashboardPage="false" />
  <BannerSlide :isLogoutPage="true" />
  <LogoutContent />
  <CoursesCards :isLogoutPage="true" />
  <FooterBar />
</template>

<script setup>
import BannerSlide from "@/components/BannerSlide.vue";
import CoursesCards from "@/components/CoursesCards.vue";
import FooterBar from "@/components/FooterBar.vue";
import LogoutContent from "@/components/LogoutContent.vue";
import NavigationBar from "@/components/NavigationBar.vue";
</script>
