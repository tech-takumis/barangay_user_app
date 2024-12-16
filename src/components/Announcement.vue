<template>
    <div class="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Create Announcement</h2>
      <form @submit.prevent="submitAnnouncement" class="space-y-6">
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">
            Message <span class="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            v-model="announcement.message"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>
  
        <div>
          <label for="event_type" class="block text-sm font-medium text-gray-700">
            Event Type <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="event_type"
            v-model="announcement.event_type"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
  
        <div>
          <label for="when" class="block text-sm font-medium text-gray-700">
            When <span class="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="when"
            v-model="announcement.when"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
  
        <div>
          <label for="where" class="block text-sm font-medium text-gray-700">
            Where <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="where"
            v-model="announcement.where"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
  
        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Announcement
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const announcement = ref({
    message: '',
    event_type: '',
    when: '',
    where: ''
  })
  
  const submitAnnouncement = () => {
    // Here you would typically send the announcement data to your backend
    console.log('Announcement submitted:', announcement.value)
    // Reset the form after submission
    announcement.value = {
      message: '',
      event_type: '',
      when: '',
      where: ''
    }
  }
  </script>
  
  <style scoped>
  /* Add any component-specific styles here if needed */
  </style>