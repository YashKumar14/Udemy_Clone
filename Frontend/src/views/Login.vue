<template>
  <NavigationBar :isDashboardPage="false" />
  <LoginForm />
  <FooterBar />
</template>

<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import LoginForm from "@/components/LoginForm.vue";
</script>
