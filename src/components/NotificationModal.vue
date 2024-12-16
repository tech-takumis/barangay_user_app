<template>
  <Teleport to="body">
    <TransitionRoot appear :show="isOpen" as="template">
      <div class="fixed z-50 p-4 sm:p-6 w-full sm:max-w-sm">
        <TransitionChild
          as="template"
          enter="transform ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden w-full">
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <InformationCircleIcon class="h-6 w-6 text-blue-400" aria-hidden="true" />
                </div>
                <div class="ml-3 w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ title }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    @click="$emit('close')"
                  >
                    <span class="sr-only">Close</span>
                    <XCircleIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionChild>
      </div>
    </TransitionRoot>
  </Teleport>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { TransitionRoot, TransitionChild } from '@headlessui/vue'
import { InformationCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
})

const emit = defineEmits(['close'])

const closeAfterDelay = () => {
  setTimeout(() => {
    emit('close')
  }, 5000) // Close after 5 seconds
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    closeAfterDelay()
  }
})

onMounted(() => {
  if (props.isOpen) {
    closeAfterDelay()
  }
})
</script>

<style scoped>
@media (max-width: 640px) {
  .fixed {
    top: 0;
    right: 0;
    left: 0;
  }
}

@media (min-width: 641px) {
  .fixed {
    top: 1rem;
    right: 1rem;
  }
}
</style>

