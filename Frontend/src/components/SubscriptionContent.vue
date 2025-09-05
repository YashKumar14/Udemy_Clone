<template>
  <h4 class="subscription-heading">Subscribe to Udemy’s top courses</h4>

  <p class="get-course">
    {{ subscriptionContent }}
    <a-button type="link" href="#" class="learn-more">Learn more</a-button>
  </p>

  <a-button
    type="link"
    href="#"
    :class="['subscription-btn', { 'discount-applied': isDiscount }]"
  >
    Start subscription
  </a-button>

  <p class="plan-price">Starting at ₹850 per month</p>

  <p class="cancel">Cancel anytime</p>
</template>

<script setup>
const { subscriptionContent, isDiscount } = defineProps({
  subscriptionContent: {
    type: String,
    required: true,
  },
  isDiscount: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.subscription-heading {
  font-size: 22px;
  font-weight: 700;
  margin: 0px;
}

.get-course {
  font-size: 14px;
  font-weight: 400;
  margin: 0px 0px 16px;
  line-height: 1.2;
}

.ant-btn-link.learn-more {
  color: #6d28d2;
  font-weight: 700;
  height: auto;
  padding: 0px;
}

:deep(.learn-more span) {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: #af72fd;
  color: #6d28d2;
}

:deep(.learn-more span):hover {
  color: #521e9f;
}

.subscription-btn {
  color: #fff;
  background-color: #6d28d2;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 0px;
  height: 48px;
}

.subscription-btn:hover {
  background-color: #892de1;
  color: #fff !important;
}

.plan-price,
.cancel {
  font-size: 12px;
  margin: 8px 0px 0px;
  text-align: center;
  color: #595c73;
}

.discount-applied {
  color: #6d28d2 !important;
  background-color: #fff !important;
  border-color: #6d28d2 !important;
}

.discount-applied:hover {
  background-color: #d1d2e0 !important;
}
</style>
