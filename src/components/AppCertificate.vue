<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Back Button -->
      <div class="mb-4">
        <button 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="goBack" 
        >
          <svg class="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-xl overflow-hidden">
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Document Preview Column -->
          <div class="p-6 border-r border-gray-200">
            <img 
              :src="file" 
              alt="Proof of Residency Template" 
              class="w-full h-auto shadow-lg rounded-lg"
            />
          </div>
  
          <!-- Form Column -->
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  file: {
    type: String,
    default: 'https://i.postimg.cc/BvQFMdrF/prof-of-residency.webp' 
  }
})

const goBack = () => {
  router.push('/dashboard')
}
</script>
  
<style scoped>
/* Add any additional custom styles here */
</style>

