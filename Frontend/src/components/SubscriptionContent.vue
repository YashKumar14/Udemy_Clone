<template>
  <div id="subscription-content">
    <h4>Subscribe to Udemy’s top courses</h4>
    <p id="get-course">
      {{ subscriptionContent }}
      <a href="#" id="learn-more">Learn more</a>
    </p>
    <a-button
      type="link"
      href="#"
      id="subscription-btn"
      :class="{ 'discount-applied': isDiscount }"
    >
      Start subscription
    </a-button>
    <p id="plan-price">Starting at ₹850 per month</p>
    <p id="cancel">Cancel anytime</p>
  </div>
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
h4 {
  font-size: 22px;
  font-weight: 700;
  margin: 0px;
}
#get-course {
  font-size: 14px;
  font-weight: 400;
  margin: 0px 0px 16px;
}
#learn-more {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-color: #af72fd;
  color: #6d28d2;
  font-weight: 700;
}

#learn-more:hover {
  color: #521e9f;
}

#subscription-btn {
  color: #fff;
  background-color: #6d28d2;
}

#subscription-btn {
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 0px;
  height: 48px;
}

#subscription-btn:hover {
  background-color: #892de1;
}

#plan-price,
#cancel {
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
