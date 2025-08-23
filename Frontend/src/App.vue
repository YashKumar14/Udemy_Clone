<script setup>
import { cleanUpLocalStorageIfCookieExpired } from "@/utils/cookie";

cleanUpLocalStorageIfCookieExpired();
</script>

<template>
  <router-view />
</template>
<style></style>
