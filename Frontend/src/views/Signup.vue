<template>
  <NavigationBar :isDashboardPage="false" />
  <SignUpForm />
  <FooterBar />
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import SignUpForm from "@/components/SignUpForm.vue";
</script>
