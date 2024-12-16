<script setup>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex items-center justify-center">
        <router-link to="/" class="flex items-center text-indigo-600 hover:text-indigo-500">
          <ChevronLeftIcon class="h-5 w-5 mr-1" />
          <span class="text-sm font-medium">Back to Welcome Page</span>
        </router-link>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <slot />
      </div>
    </div>
  </div>
</template>

