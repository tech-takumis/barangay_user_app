<template>
    <transition name="notification">
      <div v-if="isVisible" class="fixed top-4 z-50 right-4 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-4">
          <div class="flex items-center">
            <AlarmCheckIcon class="h-6 w-6 text-green-500 mr-2" />
            <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
          </div>
          <p class="mt-2 text-sm text-gray-600">{{ message }}</p>
        </div>
        <div class="bg-gray-100 px-4 py-3 flex justify-end">
          <button
            @click="close"
            class="text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none focus:underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ShoppingCartIcon,AlarmCheckIcon } from 'lucide-vue-next';
  
  const props = defineProps({
    title: {
      type: String,
      default: 'Notification'
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    },
   
  });
  
  const emit = defineEmits(['close']);
  
  const isVisible = ref(false);
  let timeoutId = null;
  
  const show = () => {
    isVisible.value = true;
    if (props.duration > 0) {
      timeoutId = setTimeout(close, props.duration);
    }
  };
  
  const close = () => {
    isVisible.value = false;
    emit('close');
  };
  
  onMounted(() => {
    show();
  });
  
  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
  </script>
  
  <style scoped>
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.5s ease;
  }
  .notification-enter-from,
  .notification-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>