<template>
    <div class="relative">
      <button 
      class="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors duration-300"
      @click="toggleChat" >
        <MessageCircle v-if="!isChatOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
  
      <transition name="fade">
        <div v-if="isChatOpen" class="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div class="bg-blue-500 text-white p-4">
            <h3 class="text-lg font-semibold">Chat</h3>
          </div>
          <div class="h-64 overflow-y-auto p-4 space-y-4">
            <div v-for="(message, index) in messages" :key="index" :class="{'text-right': message.sender === 'user'}">
              <span :class="{'bg-blue-100 text-blue-800 rounded-lg py-2 px-4 inline-block': message.sender === 'user', 'bg-gray-100 text-gray-800 rounded-lg py-2 px-4 inline-block': message.sender === 'bot'}">
                {{ message.text }}
              </span>
            </div>
          </div>
          <div class="p-4 border-t">
            <form 
            class="flex"
            @submit.prevent="sendMessage"> 
              <input v-model="message.message" type="text" placeholder="Type a message..." class="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300">Send</button>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { MessageCircle, X } from 'lucide-vue-next'
  import { useUsers } from '../stores/user';
  
  const isChatOpen = ref(false)
  const store = useUsers()
  const messages = ref([
    { sender: 'bot', text: 'Hello! How can I help you today?' },
    { sender: 'user', text: 'I have a question about the latest article.' },
    { sender: 'bot', text: 'Sure, I\'d be happy to help. What would you like to know?' }
  ])
  
  const message = ref({
    'message': '',
    'sender_id': store.userData?.id,
  })
  const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
  }

  
  const sendMessage = async () => {
  if (message.value.message.trim()) {
    // Push the user's new message to the `messages` array immediately
    messages.value.push({
      sender: 'user',
      text: message.value.message.trim(),
    });

    // Send the message to the backend
    await store.sendMessage(message);

    // Clear the input field after sending
    message.value.message = '';

    // Simulate bot response (optional)
    setTimeout(() => {
      messages.value.push({
        sender: 'bot',
        text: 'Thank you for your message. I\'ll get back to you shortly.',
      });
    }, 1000);
  }
};

  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>