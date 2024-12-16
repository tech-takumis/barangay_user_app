<script setup>
import { ref, computed } from 'vue'
import { useUsers } from '@/stores/user'
import { UserRole } from '@/enums/UserRole'
import GuestLayout from '../../layouts/GuestLayout.vue';

const store = useUsers()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  address: '',
  contact_number: '',
  civil_status: '',
  occupation: '',
  residency_start_date: '',
  remarks: '',
  terms: false,
})

const processing = ref(false)
const errors = ref({})

const positions = Object.values(UserRole)
const civilStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Engaged', 'Domestic Partnership', 'Annulled']

const submitRegister = async () => {
  processing.value = true
  errors.value = {}
  try {
    await store.register(form, errors, processing)
    form.value = {
      name: '', email: '', password: '', password_confirmation: '', position: '',
      address: '', contact_number: '', civil_status: '', occupation: '',
      residency_start_date: '', remarks: '', terms: false
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: ['An unexpected error occurred.'] }
    }
  } finally {
    processing.value = false
  }
}
</script>

<template>
    <GuestLayout>
      <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register 
          </h2>
        </div>
  
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" @submit.prevent="submitRegister">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <!-- First Column -->
                <div class="space-y-6">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div class="mt-1">
                      <input 
                        id="name" v-model="form.name" type="text" required autocomplete="name"
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name[0] }}</p>
                  </div>
  
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div class="mt-1">
                      <input 
                        id="email" v-model="form.email" type="email" required autocomplete="email"
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email[0] }}</p>
                  </div>
  
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div class="mt-1">
                      <input 
                        id="password" v-model="form.password" type="password" required autocomplete="new-password"
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password[0] }}</p>
                  </div>
  
                  <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div class="mt-1">
                      <input 
                        id="password_confirmation" v-model="form.password_confirmation" type="password" required
                        autocomplete="new-password"
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>
                </div>
  
                <!-- Second Column -->
                <div class="space-y-6">
                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div class="mt-1">
                      <input 
                        id="address" v-model="form.address" type="text" 
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <p v-if="errors.address" class="mt-2 text-sm text-red-600">{{ errors.address[0] }}</p>
                  </div>
  
                  <div>
                    <label for="contact_number" class="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                      <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        +63
                      </span>
                      <input 
                        id="contact_number" v-model="form.contact_number" type="tel" 
                        class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <p v-if="errors.contact_number" class="mt-2 text-sm text-red-600">{{ errors.contact_number[0] }}</p>
                  </div>
  
                  <div>
                    <label for="civil_status" class="block text-sm font-medium text-gray-700">
                      Civil Status
                    </label>
                    <div class="mt-1">
                      <select 
                        id="civil_status" v-model="form.civil_status" 
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="" disabled>Select civil status</option>
                        <option v-for="status in civilStatuses" :key="status" :value="status">
                          {{ status }}
                        </option>
                      </select>
                    </div>
                    <p v-if="errors.civil_status" class="mt-2 text-sm text-red-600">{{ errors.civil_status[0] }}</p>
                  </div>
  
                  <div>
                    <label for="occupation" class="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
                    <div class="mt-1">
                      <input 
                        id="occupation" v-model="form.occupation" type="text" 
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <p v-if="errors.occupation" class="mt-2 text-sm text-red-600">{{ errors.occupation[0] }}</p>
                  </div>
  
                  <div>
                    <label for="residency_start_date" class="block text-sm font-medium text-gray-700">
                      Residency Start Date
                    </label>
                    <div class="mt-1">
                      <input 
                        id="residency_start_date" v-model="form.residency_start_date" type="date" 
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <p v-if="errors.residency_start_date" class="mt-2 text-sm text-red-600">{{ errors.residency_start_date[0] }}</p>
                  </div>
  
                  <div>
                    <label for="remarks" class="block text-sm font-medium text-gray-700">
                      Remarks
                    </label>
                    <div class="mt-1">
                      <textarea 
                        id="remarks" v-model="form.remarks" rows="3"
                        class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                    <p v-if="errors.remarks" class="mt-2 text-sm text-red-600">{{ errors.remarks[0] }}</p>
                  </div>
                </div>
              </div>
  
              <div>
                <button 
                  type="submit" :disabled="processing"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                  {{ processing ? 'Processing...' : 'Register Staff' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GuestLayout>
</template>