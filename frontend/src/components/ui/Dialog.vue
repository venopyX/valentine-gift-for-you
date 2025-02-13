<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="modelValue" 
         class="fixed inset-0 z-50 overflow-y-auto"
         role="dialog"
         aria-modal="true">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
           @click="$emit('update:modelValue', false)"></div>
      
      <!-- Dialog -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full
                    transform transition-all">
          <!-- Close button -->
          <button 
            @click="$emit('update:modelValue', false)"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-500
                   focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full p-1"
            aria-label="Close dialog"
          >
            ✕
          </button>
          
          <!-- Content -->
          <div class="mt-2">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>
