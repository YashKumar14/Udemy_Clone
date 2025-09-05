<template>
  <div class="notifications" v-if="isNotificationVisible">
    <div class="text" v-for="({ data }, index) in data" :key="index">
      <router-link to="">
        <span class="title" v-html="data.title"></span>

        <span class="subtitle" v-html="data.subtitle"></span>
      </router-link>

      <div class="timer" v-if="data.enable_timer && showTimeInHours">
        Ends in {{ timeLeft.hours }}h {{ timeLeft.minutes }}m
        {{ timeLeft.seconds }}s
      </div>

      <div class="timer" v-else>{{ humanReadableTimeDiff }} left!</div>
    </div>

    <CloseOutlined class="close-icon" @click="closeNotification" />
  </div>
</template>

<script setup>
import { CloseOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import { onUnmounted, ref, watch, inject } from "vue";
import { differenceInSeconds, formatDistanceToNow, parseISO } from "date-fns";

const data = ref("");
const timeLeft = ref({ hours: 0, minutes: 0, seconds: 0 });
const endTime = ref("");
const showTimeInHours = ref(false);
const humanReadableTimeDiff = ref();
const toggleNotification = inject("toggleNotification");
const isNotificationVisible = inject("isNotificationVisible");

localStorage.setItem("remainingTime", JSON.stringify(timeLeft));

const fetchAPi = async () => {
  try {
    const response = await axios.get(
      "https://www.udemy.com/api-2.0/notices/me/",
      {
        params: {
          type: "smart_bar",
          limit: 1,
        },
      }
    );

    data.value = response.data.results;
    console.log(data.value);
    console.log(data.value[0].data.enable_timer);

    if (data.value && data.value.length > 0) {
      endTime.value = data.value[0].membership.end_time;
      console.log(endTime.value);
      const savedTime = JSON.parse(localStorage.getItem("remainingTime"));
      if (savedTime) {
        timeLeft.value = savedTime;
        //   startCountdownFromSavedTime(savedTime);
        // } else {
        startCountdown(endTime.value);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// const startCountdownFromSavedTime = (savedTime) => {
//   const now = new Date().getTime();
//   const remainingMillis =
//     (savedTime.hours * 3600 + savedTime.minutes * 60 + savedTime.seconds) *
//     1000;
//   const updateEndTime = now + remainingMillis;

//   startCountdown(updateEndTime);
// };

let timeInterval = null;

const startCountdown = (endTime) => {
  clearInterval(timeInterval);

  const calculateTimeLeft = () => {
    const endDate =
      typeof endTime === "string" ? parseISO(endTime) : new Date(endTime);

    const currentDate = new Date();

    const diffInSeconds = differenceInSeconds(endDate, currentDate);

    humanReadableTimeDiff.value = formatDistanceToNow(endDate, {
      addSuffix: false,
    });
    // console.log(`Human-readable format: ${humanReadableTimeDiff.value}`);
    if (diffInSeconds > 0) {
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;
      timeLeft.value = { hours, minutes, seconds };

      if (hours < 24) {
        showTimeInHours.value = true;
      }
      // saveRemainingTime(timeLeft.value);
    } else {
      timeLeft.value = { hours: 0, minutes: 0, seconds: 0 };
      clearInterval(timeInterval);
      localStorage.removeItem("remainingTime");
    }
  };

  calculateTimeLeft();
  timeInterval = setInterval(calculateTimeLeft, 1000);
};

// const saveRemainingTime = (timeLeft) => {
//   localStorage.setItem("remainingTime", JSON.stringify(timeLeft));
// };

const closeNotification = () => {
  toggleNotification(false);
};

fetchAPi();

watch(timeLeft, (newTimeLeft, oldTimeLeft) => {
  if (
    newTimeLeft &&
    JSON.stringify(newTimeLeft) !== JSON.stringify(oldTimeLeft)
  ) {
    // console.log("timeLeft updated:", newTimeLeft, "old value:", oldTimeLeft);
    localStorage.setItem("remainingTime", JSON.stringify(newTimeLeft));
  }
});

onUnmounted(() => {
  clearInterval(timeInterval);
});
</script>

<style scoped>
.notifications {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.4;
  background-color: #c2e9eb;
  color: #2f2d31;
  font-size: 16px;
}

.text {
  padding: 16px 0px;
}

a {
  text-decoration: none;
  color: #2f2d31;
  cursor: pointer;
}

.close-icon {
  position: absolute;
  right: 0px;
  margin: 8px;
  padding: 0px 10px;
}

.close-icon:hover {
  cursor: pointer;
}

.title {
  padding: 0px 5px 0px 0px;
  font-weight: 700;
}

.subtitle {
  text-decoration: none;
  text-underline-offset: 0.4rem;
}

:deep(.subtitle a) {
  color: #2f2d31;
  text-underline-offset: 0.4rem;
}

.timer {
  font-weight: 700;
  font-size: 18px;
  text-align: center;
}
</style>
