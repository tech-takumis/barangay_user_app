<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useUsers } from '../stores/user';
import { RouterLink } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import AppCertificate from './AppCertificate.vue';

const route = useRoute();
const router = useRouter();
const certificate = ref({})
const certId = ref()
const store = useUsers();

const formData = reactive({
  status: 'pending',
});

const updateDynamicFields = () => {
    if (certificate.value.attributes) {
        certificate.value.attributes.forEach((attr) => {
            formData[`attributes.${attr.id}`] = '';
        });
    }
    if (certificate.value.requirements) {
        certificate.value.requirements.forEach((req) => {
            formData[`requirements.${req.id}`] = '';
        });
    }
};


const handleFileChange = (event, fieldName) => {
  const file = event.target.files[0];
  if (file) {
    formData[fieldName] = file;
  }
};

const submitForm = async () => {
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null) {
      if (value instanceof File) {
        data.append(key, value);
      } else {
        data.append(key, value);
      }
    }
  });

  try {
    await store.requestCertificate(data);
    // Optionally, add a success message or redirect
  } catch (error) {
    console.error("Submission failed:", error.response?.data || error);
    // Optionally, show an error message to the user
  }
};

const goBack = () => {
  router.push('/dashboard');
};

onMounted(async () => {
    try {
        certId.value = route.params.id;
        formData.certificate_id = certId.value
        certificate.value = await store.getCertificate(certId.value);
        if (certificate.value) updateDynamicFields();
    } catch (error) {
        console.error("Error in onMounted:", error);
        router.push('/dashboard');
    }
});

</script>

<template>
  <AppCertificate :file="certificate.template">  
    <form @submit.prevent="submitForm" class="space-y-4">
      <div v-if="certificate.attributes && certificate.attributes.length > 0">
        <div v-for="attr in certificate.attributes" :key="attr.id" class="mb-3">
          <label :for="`attr-${attr.id}`" class="block text-sm font-medium text-gray-700">{{ attr.placeholder }}</label>
          <input
            :id="`attr-${attr.id}`"
            v-model="formData[`attributes.${attr.id}`]"
            :type="attr.data_type === 'number' ? 'number' : 'text'"
            :required="attr.is_required"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div v-if="certificate.requirements && certificate.requirements.length > 0">
        <div v-for="req in certificate.requirements" :key="req.id" class="mb-3">
          <label :for="`req-${req.id}`" class="block text-sm font-medium text-gray-700">{{ req.name }}</label>
          <input 
            v-if="req.datatype === 'text'"
            :id="`req-${req.id}`"
            v-model="formData[`requirements.${req.id}`]"
            :required="req.is_required"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          <input 
            v-else-if="req.datatype === 'file'"
            :id="`req-${req.id}`"
            type="file"
            :required="req.is_required"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            @change="handleFileChange($event, `requirements.${req.id}`)"
          />
        </div>
      </div>

      <div class="pt-4">
        <button 
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Application
        </button>
      </div>
    </form>
  </AppCertificate>
</template>

