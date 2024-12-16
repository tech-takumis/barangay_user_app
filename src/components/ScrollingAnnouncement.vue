<template>
  <div v-if="latestAnnouncement" class="bg-indigo-100 p-4 rounded-lg overflow-hidden">
    <div class="scrolling-text whitespace-nowrap">
      {{ formattedAnnouncement }}
    </div>
  </div>
  <div v-else class="bg-indigo-100 p-4 rounded-lg text-center">
    No announcements available
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  announcements: {
    type: Object,
    required: true
  }
})

const latestAnnouncement = computed(() => props.announcements?.[0] || null)

const formattedAnnouncement = computed(() => {
  if (!latestAnnouncement.value) return ''
  
  const { message, event_type, when, where } = latestAnnouncement.value
  const formattedWhen = when ? new Date(when).toLocaleString() : 'Date not specified'
  return `${message} | Event: ${event_type} | When: ${formattedWhen} | Where: ${where}`
})
</script>

<style scoped>
.scrolling-text {
  display: inline-block;
  padding-left: 100%;
  animation: scroll 20s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}
</style>

