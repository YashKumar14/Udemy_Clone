<script setup>
import { cleanUpLocalStorageIfCookieExpired } from "@/utils/cookie";
import { ref, provide } from "vue";

const isNotificationVisible = ref(true);

const toggleNotification = (value) => {
  isNotificationVisible.value = value;
};

provide("isNotificationVisible", isNotificationVisible);
provide("toggleNotification", toggleNotification);

cleanUpLocalStorageIfCookieExpired();
</script>

<template>
  <router-view />
</template>
<style></style>
