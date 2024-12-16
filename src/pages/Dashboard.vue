<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import Chat from '@/components/Chat.vue'
import CertificateListing from '../components/CertificateListing.vue'
import ScrollingAnnouncement from '../components/ScrollingAnnouncement.vue'
import { useUsers } from '../stores/user'
import { computed } from 'vue'

const store = useUsers()

const announcement = computed(() => store.announcement || [])

</script>

<template>
  <AuthenticatedLayout>
    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
          <div class="p-6 bg-white border-b border-gray-200">
            <ScrollingAnnouncement :announcements="announcement" />
          </div>
        </div>
        <CertificateListing />
      </div>
    </div>
    <Chat />
  </AuthenticatedLayout>
</template>

