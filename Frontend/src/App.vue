<template>
  <Notification v-if="showNotification" />
  <NavigationBar v-if="navbarPage" :isDashboardPage="isDashboardPage" />
  <router-view />
  <FooterBar />
</template>

<script setup>
import { cleanUpLocalStorageIfCookieExpired } from "@/utils/cookie";
import { ref, provide, computed } from "vue";
import Notification from "@/components/Notification.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import FooterBar from "@/components/FooterBar.vue";
import { useToken } from "@/utils/useToken.js";
import { useRoute } from "vue-router";

const { token } = useToken();
const route = useRoute();

const isNotificationVisible = ref(true);

const toggleNotification = (value) => {
  isNotificationVisible.value = value;
};

provide("isNotificationVisible", isNotificationVisible);
provide("toggleNotification", toggleNotification);

cleanUpLocalStorageIfCookieExpired();

const showNotification = computed(() => route.meta.showNotification ?? false);

const navbarPage = computed(() => route.meta.navbarPage || null);

const isDashboardPage = computed(() => {
  const navbarPage = route.meta.navbarPage;
  console.log({ navbarPage, token: token.value });

  const result =
    { dashboard: true, course: !!token.value, "not-found": !!token.value }[
      navbarPage
    ] ?? false;

  return result;
});
</script>

<style></style>
