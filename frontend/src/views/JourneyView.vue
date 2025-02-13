<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 to-white">
    <!-- Progress Bar -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-pink-100 z-50">
      <div class="h-full bg-pink-500 transition-all duration-300"
           :style="{ width: `${progress}%` }"></div>
    </div>

    <!-- Main Content -->
    <router-view v-slot="{ Component }">
      <transition 
        name="page"
        mode="out-in"
        @before-leave="beforePageLeave"
        @after-enter="afterPageEnter">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Background Hearts -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div v-for="n in 20" 
           :key="n"
           class="absolute text-2xl animate-float-heart"
           :style="{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${5 + Math.random() * 5}s`,
             opacity: 0.1
           }">
        ❤️
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Progress tracking
const progress = ref(0)
const routeOrder = {
  'form': 0,
  'teaser': 20,
  'puzzle': 40,
  'story': 60,
  'map': 80,
  'keepsake': 100
}

// Update progress based on current route
watch(
  () => route.name,
  (newRoute) => {
    if (newRoute && routeOrder[newRoute]) {
      progress.value = routeOrder[newRoute]
    }
  },
  { immediate: true }
)

// Page transition handlers
function beforePageLeave(el) {
  el.style.opacity = 0
  el.style.transform = 'scale(0.95)'
}

function afterPageEnter(el) {
  el.style.opacity = 1
  el.style.transform = 'scale(1)'
}
</script>

<style scoped>
/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Floating Hearts Animation */
@keyframes float-heart {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.animate-float-heart {
  animation: float-heart ease-in-out infinite;
  position: absolute;
}
</style>