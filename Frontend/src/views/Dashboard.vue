<template>
  <Notification />
  <NavigationBar :isDashboardPage="true" />
  <DashboardContent />
  <FooterBar />
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import DashboardContent from "@/components/DashboardContent.vue";
import FooterBar from "@/components/FooterBar.vue";
import Notification from "@/components/Notification.vue";
</script>
