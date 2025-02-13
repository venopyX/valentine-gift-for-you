import { createRouter, createWebHistory } from 'vue-router'
import JourneyView from '../views/JourneyView.vue'
import FormPage from '../components/FormPage.vue'
import TeaserPage from '../components/TeaserPage.vue'
import PuzzleLock from '../components/PuzzleLock.vue'
import StoryChapter from '../components/StoryChapter.vue'
import MemoryMap from '../components/MemoryMap.vue'
import KeepsakeCard from '../components/KeepsakeCard.vue'

const routes = [
  {
    path: '/',
    component: JourneyView,
    children: [
      { path: '', redirect: '/form' },
      { path: 'form', name: 'form', component: FormPage },
      { path: 'teaser', name: 'teaser', component: TeaserPage },
      { path: 'puzzle', name: 'puzzle', component: PuzzleLock },
      { path: 'story', name: 'story', component: StoryChapter },
      { path: 'map', name: 'map', component: MemoryMap },
      { path: 'keepsake', name: 'keepsake', component: KeepsakeCard }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to handle direct URL access
router.beforeEach((to, from, next) => {
  const hasParams = to.query.name || to.query.date || to.query.memories
  
  // If trying to access a protected route without parameters
  if (to.name !== 'form' && !hasParams) {
    next({ name: 'form' })
  } else {
    next()
  }
})

export default router
