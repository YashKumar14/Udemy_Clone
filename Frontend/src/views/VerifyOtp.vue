<template>
  <NavigationBar :isDashboardPage="false" />
  <OtpVerifyForm />
  <FooterBar />
</template>

<script setup>
import FooterBar from "@/components/FooterBar.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import OtpVerifyForm from "@/components/OtpVerifyForm.vue";
</script>
