<template>
  <AuthenticatedLayout>
    <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div class="relative py-3 px-4 w-full max-w-7xl mx-auto">
        <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Certificate Requests</h1>
          
          <div class="mb-4 flex justify-between items-center">
            <div class="flex space-x-2">
              <button
                v-for="option in pageSizeOptions"
                :key="option"
                :class="[
                  'px-3 py-1 border rounded-md text-sm',
                  pageSize === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
                @click="pageSize = option"
              >
                {{ option }}
              </button>
            </div>
            <input
              v-model="search"
              type="text"
              placeholder="Search..."
              class="px-3 py-2 border rounded-md"
            />
          </div>
  
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="column in columns"
                    :key="column.key"
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy(column.key)"
                  >
                    {{ column.label }}
                    <span v-if="sortColumn === column.key">
                      {{ sortDirection === 'asc' ? '▲' : '▼' }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="request in paginatedRequests" 
                  :key="request.id" 
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="navigateToCredentials(request.id)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ request.id }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ request.certificate.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="flex items-center justify-center">
                      <component :is="getStatusIcon(request.status)" class="w-6 h-6" :class="getStatusColor(request.status)" />
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(request.created_at) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="mt-4 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ startIndex + 1 }}</span>
                to
                <span class="font-medium">{{ endIndex }}</span>
                of
                <span class="font-medium">{{ filteredRequests.length }}</span>
                results
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                :disabled="currentPage === 1"
                class="px-3 py-1 border rounded-md text-sm"
                :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
                @click="currentPage--"
              >
                Previous
              </button>
              <button
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border rounded-md text-sm"
                :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
                @click="currentPage++"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ClockIcon, CheckCircleIcon, XCircleIcon } from 'lucide-vue-next'
import { useUsers } from '../stores/user'
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue'
import { useRouter } from 'vue-router'

const store = useUsers()
const router = useRouter()

const certificateRequests = computed(() => store.certificateRequest)

const search = ref('')
const sortColumn = ref('id')
const sortDirection = ref('desc')
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50]
const certificate = ref()

const columns = [
  { key: 'id', label: 'Request ID' },
  { key: 'certificate_id', label: 'Certificate' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created At' }
]

const filteredRequests = computed(() => {
  return certificateRequests.value.filter(request =>
    request.id.toString().includes(search.value.toLowerCase()) ||
    getCertificateName(request.certificate_id).toLowerCase().includes(search.value.toLowerCase()) ||
    request.status.toLowerCase().includes(search.value.toLowerCase())
  )
})

const sortedRequests = computed(() => {
  return [...filteredRequests.value].sort((a, b) => {
    let aValue = a[sortColumn.value]
    let bValue = b[sortColumn.value]

    if (sortColumn.value === 'certificate_id') {
      aValue = getCertificateName(a.certificate_id)
      bValue = getCertificateName(b.certificate_id)
    }

    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedRequests.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, filteredRequests.value.length))

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return ClockIcon
    case 'approved':
      return CheckCircleIcon
    case 'reject':
      return XCircleIcon
    default:
      return null
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-500'
    case 'approved':
      return 'text-green-500'
    case 'rejected':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const navigateToCredentials = (id) => {
  router.push({ name: 'CertificateRequestCredential', params: { id: id } })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
