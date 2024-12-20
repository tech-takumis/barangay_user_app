<template>
  <AuthenticatedLayout>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 px-4 w-full max-w-7xl mx-auto">
        <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Certificate Request Details</h1>
          
          <div v-if="request" class="space-y-8">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h2 class="text-2xl font-semibold text-gray-700">Request ID: {{ request.id }}</h2>
                <p class="text-lg text-gray-600">Status: {{ request.status }}</p>
                <p class="text-lg text-gray-600">Created: {{ formatDate(request.created_at) }}</p>
              </div>
              <div>
                <p class="text-lg text-gray-600">User ID: {{ request.user_id }}</p>
                <p class="text-lg text-gray-600">Certificate ID: {{ request.certificate_id }}</p>
                <p class="text-lg text-gray-600">Updated: {{ formatDate(request.updated_at) }}</p>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Attributes</h3>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="attr in request.attribute_values" :key="attr.id" class="bg-gray-50 p-4 rounded-lg">
                  <p class="font-medium text-gray-700">{{ attr.attribute_name }}</p>
                  <p class="text-gray-600">{{ attr.attribute_value }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-700 mb-4">Requirements</h3>
              <div class="space-y-4">
                <div v-for="req in request.requirement_values" :key="req.id" class="bg-gray-50 p-4 rounded-lg">
                  <p class="font-medium text-gray-700">{{ req.requirement_name }}</p>
                  <div v-if="isImage(req.requirement_value)" class="mt-2">
                    <img :src="getImageUrl(req.requirement_value)" :alt="req.requirement_name" class="max-w-md rounded-lg shadow-md">
                  </div>
                  <p v-else class="text-gray-600">{{ req.requirement_value }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center text-gray-600">
            Loading request details...
          </div>

          <div class="mt-8 flex justify-between">
            <button 
              @click="goBack" 
              class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Requests
            </button>
            <button 
              @click="deleteCertificate" 
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '../stores/user'
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue'

const route = useRoute()
const router = useRouter()
const store = useUsers()

const request = ref(null)

onMounted(async () => {
  const requestId = parseInt(route.params.id)
   console.log("Request ID from route:", requestId)
  request.value = store.certificateRequest.find(req => req.id === requestId)
})

const isImage = (value) => {
  return value.match(/\.(jpeg|jpg|gif|png)$/) != null
}

const getImageUrl = (path) => {
  // Assuming the path is relative to your public directory
  return `/${path}`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  router.push({ name: 'certificate_requested' })
}

const deleteCertificate = async () =>{
    try {
      await store.deleteCertificate(request.value.id);
      router.push({name: 'certificate_requested'})

    } catch(error){
      console.log('An error occurred while deleting the request')
    }
}

</script>