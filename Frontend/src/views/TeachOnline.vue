<template>
  <NavigationBar :isDashboardPage="false" />
  <SignUpForm />
  <FooterBar />
</template>

<script setup>
import FooterBar from "@/components/FooterBar.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import SignUpForm from "@/components/SignUpForm.vue";
</script>
