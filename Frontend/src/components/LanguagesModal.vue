<template>
  <a-modal
    class="lang-modal"
    v-model:open="modalVisible"
    title="Choose a language"
    centered
    :footer="null"
    :bodyStyle="langStyles"
  >
    <router-link
      :class="['lang-links', { 'selected-lang': lang === selectedLanguage }]"
      to=""
      v-for="lang in languages"
      :key="lang"
      :style="langInnerStyles"
      @click="updateSelectedLanguage(lang)"
    >
      {{ lang }}
    </router-link>
  </a-modal>
</template>

<script setup>
import { ref } from "vue";

const modalVisible = ref(false);
const languages = [
  "English",
  "Deutsch",
  "Español",
  "Français",
  "Bahasa Indonesia",
  "Italiano",
  "日本語",
  "한국어",
  "Nederlands",
  "Polski",
  "Português",
  "Română",
  "Русский",
  "ภาษาไทย",
  "Türkçe",
  "Tiếng Việt",
  "中文(简体)",
  "中文(繁體)",
];
const selectedLanguage = ref("English");
const emit = defineEmits(["selectedLanguage"]);

const handleModal = () => {
  console.log(" modalVisible.value", modalVisible.value);
  modalVisible.value = !modalVisible.value;
};

defineExpose({
  handleModal,
});

const updateSelectedLanguage = (language) => {
  selectedLanguage.value = language;
  console.log("selectedLanguage", selectedLanguage.value);
  modalVisible.value = !modalVisible.value;
  emit("selectedLanguage", selectedLanguage.value);
};

const langStyles = {
  display: "flex",
  flexFlow: "column wrap",
  maxHeight: "250px",
};

const langInnerStyles = {
  padding: "8px 8px 8px 16px",
};
</script>

<style scoped>
.lang-links {
  text-decoration: none;
  color: #2d2f31;
  font-size: 16px;
  font-weight: 400;
  border-radius: 5px;
}

.lang-links:hover {
  color: #6d28d2;
  background-color: color-mix(in sRGB, #6d28d2 12%, transparent);
}

.selected-lang {
  border: 1px solid #9194ac;
}
</style>

<style>
.lang-modal.ant-modal .ant-modal-close {
  top: 14px;
  left: 460px;
  width: 40px;
  height: 40px;
}

.lang-modal .ant-modal-title {
  padding: 0px 0px 15px 0px;
}
</style>
