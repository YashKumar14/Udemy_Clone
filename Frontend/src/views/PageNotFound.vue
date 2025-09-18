<template>
  <NavigationBar :isDashboardPage="false" />

  <div class="not-found-page">
    <a-image
      src="/error-desktop-v1.webp"
      alt="error-page-img"
      class="not-found-image"
      :preview="false"
    />

    <h1>We can’t find the page you’re looking for</h1>

    <p>
      Visit our
      <router-link to="#">support page</router-link>
      for further assistance.
    </p>
  </div>

  <FooterBar />
</template>

<script setup>
import FooterBar from "@/components/FooterBar.vue";
import NavigationBar from "@/components/NavigationBar.vue";
</script>

<style scoped>
.not-found-page {
  text-align: center;
  padding: 48px 24px 64px;
  color: #2a2b2f;
  line-height: 1.6;
}

.not-found-page h1 {
  font-size: calc(1.5rem + (2 - 1.5) * calc((100vw - 22.5rem) / (180 - 22.5)));
  margin: 1.5rem auto 0.5rem auto;
  max-width: 30rem !important;
  line-height: 1.1;
}

.not-found-page p {
  font-size: calc(
    1.06rem + (1.13 - 1.06) * calc((100vw - 22.5rem) / (180 - 22.5))
  );
  max-width: 30rem !important;
  margin: 0 auto;
}

.not-found-page a {
  text-underline-offset: 4px;
  color: #6d28d2 !important;
}
</style>
