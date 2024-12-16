<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-serif text-center text-gray-900 mb-3">Browse Certificates</h1>
      <p class="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        These are all well-requested barangay certificates we offer for our residents
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="certificate in certificates" 
          :key="certificate.id" 
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          <!-- Image Container -->
          <div class="aspect-w-16 aspect-h-10 overflow-hidden bg-gray-100">
            <img
              :src="certificate.template || '/img/placeholder.jpg'"
              :alt="certificate.name"
              class="w-full h-full object-cover "
            />
          </div>

          <!-- Content Container -->
          <div class="p-8">
            <!-- Status Badge -->
            <div class="mb-4">
              <span 
                class="text-xs tracking-wider uppercase"
                :class="certificate.status === 'active' ? 'text-green-600' : 'text-gray-400'"
              >
                {{ certificate.status }}
              </span>
            </div>

            <!-- Title and Description -->
            <h2 class="font-serif text-2xl text-gray-900 mb-3">{{ certificate.name }}</h2>
            <p class="text-gray-600 text-sm leading-relaxed mb-6">{{ certificate.description }}</p>

            <!-- Action Button -->
            <div class="flex justify-end">
              <a
                :href="`/certificate/${certificate.id}`"
                :class="[
                  'inline-flex items-center text-sm font-medium transition-colors duration-200',
                  certificate.status === 'inactive' 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-600 hover:text-blue-700'
                ]"
                :aria-disabled="certificate.status === 'inactive'"
              >
                View Details
                <svg 
                  class="ml-2 w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUsers } from '../stores/user';
import router from '../router';

const store = useUsers()

const certificates = computed(() => {
  return store.certificates
})
</script>

<style>
/* Add these styles to your global CSS or component styles */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>

