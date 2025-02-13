### **Documentation: "Digital Valentine Journey" VueJS Implementation**
---

#### **1. Project Setup & Tools**
- **Framework**: Vue 3 (Composition API) + Vite (for lightweight setup).
- **Router**: Vue Router for multi-step navigation (form → teaser → puzzle → storyline → map → keepsake).
- **State Management**: Pinia (lightweight) or Vuex (optional) to store URL parameters and user progress.
- **Styling**: Tailwind CSS (utility-first for rapid design) + custom CSS animations.
- **AI Placeholder**: A `services/ai-generator.js` file to mock AI responses using hardcoded prompts.

---

#### **2. Design Guidelines**
**Color Palette** (Romantic & Subtle):
- **Primary**: `#FFB6C1` (Light Pink), `#FF69B4` (Hot Pink), `#FFFFFF` (White).
- **Accents**: `#FF1493` (Deep Pink), `#FFD700` (Gold for highlights).
- **Background**: Soft gradient (e.g., `linear-gradient(135deg, #FFB6C1 0%, #FFFFFF 100%)`).

**Typography**:
- **Headings**: `"Great Vibes", cursive` (romantic script).
- **Body**: `"Roboto", sans-serif` (clean readability).

**Animations**:
- **Transitions**: Fade-ins, subtle scale-ups on hover.
- **Loading States**: Pulse animations for interactive elements.

---

#### **3. Directory Structure**
```bash
src/
├─ assets/
│  ├─ audio/ (ambient melody)
│  ├─ images/ (teaser graphics, map markers)
│  └─ styles/ (global.css, animations.css)
├─ components/
│  ├─ FormPage.vue
│  ├─ TeaserPage.vue
│  ├─ PuzzleLock.vue
│  ├─ StoryChapter.vue
│  ├─ MemoryMap.vue
│  └─ KeepsakeCard.vue
├─ services/
│  ├─ ai-generator.js (mock AI logic)
│  └─ url-params.js (parse URL args to store in Pinia)
├─ stores/ (Pinia stores)
│  └─ userStore.js
├─ views/
│  └─ JourneyView.vue (main container for steps)
├─ App.vue
└─ main.js
```

---

#### **4. Core Implementation Steps**

**A. URL Parameter Handling**
- **Parsing**: Use `Vue Router` to extract URL parameters (e.g., `?name=Alice&date=2023-02-14`).
- **Storage**: Save parameters to Pinia store + `localStorage` (for revisits).
  ```javascript
  // stores/userStore.js
  export const useUserStore = defineStore('user', {
    state: () => ({
      name: '',
      date: '',
      memories: []
    }),
    actions: {
      initFromURL() {
        const route = useRoute();
        this.name = route.query.name || '';
        this.date = route.query.date || '';
        this.memories = route.query.memories ? route.query.memories.split(',') : [];
      }
    }
  });
  ```

**B. AI Response Generation (Placeholder)**
- **Mock Service**: Simulate AI-generated content using template literals and randomized responses.
  ```javascript
  // services/ai-generator.js
  export const generateMessage = (type, params) => {
    const { name, date, memories } = params;
    const prompts = {
      loveLetter: `Dear ${name}, From the moment we met on ${date}...`,
      poem: `Roses are red, violets blue... ${name}, my love for you...`,
      memory: `Remember when we ${memories[Math.floor(Math.random() * memories.length)]}?`
    };
    return prompts[type];
  };
  ```

**C. Key Component Logic**
1. **FormPage.vue**
   - Collects user data (recipient's name, special date, favorite memory).
   - Generates a unique link with encoded parameters.
   - Redirects to the teaser page with the generated link.
   ```javascript
   // FormPage.vue
   <template>
     <form @submit.prevent="generateLink">
       <input v-model="name" placeholder="Recipient's Name" required />
       <input v-model="date" placeholder="Special Date" required />
       <input v-model="memory" placeholder="Favorite Memory" required />
       <button type="submit">Generate Link</button>
     </form>
   </template>

   <script>
   export default {
     data() {
       return {
         name: '',
         date: '',
         memory: ''
       };
     },
     methods: {
       generateLink() {
         const link = `/teaser?name=${this.name}&date=${this.date}&memories=${this.memory}`;
         this.$router.push(link);
       }
     }
   };
   </script>
   ```

2. **TeaserPage.vue**
   - Displays animated text + optional audio toggle.
   - Redirects to `/puzzle` after 5 seconds or button click.

3. **PuzzleLock.vue**
   - Interactive drag-and-drop or click-to-solve puzzle (e.g., rearrange letters of the recipient’s name).
   - On solve, trigger Pinia action to unlock next step.

4. **MemoryMap.vue**
   - SVG/Canvas-based map with clickable markers.
   - On marker click, call `generateMessage('memory', params)` and display in a modal.

**D. Responsive Layout**
- Use Tailwind’s grid/flex to ensure mobile-friendly design.
- Constrain max-width to 1200px for larger screens.

---

#### **5. AI Prompt Engineering (Future-Proofing)**
When integrating real AI (e.g., OpenAI):
- **Structured Prompts**:
  ```text
  "Write a 3-sentence love letter for [name] mentioning [date]. Use whimsical metaphors."
  "Generate a haiku about [memory] with a romantic tone."
  ```
- **Store Parameters**: Combine URL args with predefined prompt templates.

---

#### **6. Optional Enhancements**
- **Cookie Fallback**: Use `js-cookie` to retain parameters if localStorage is blocked.
- **Progress Tracker**: A visual progress bar at the bottom (e.g., 5 steps total).
- **Sound Effects**: Tiny audio cues for interactions (e.g., puzzle solve "ding").

---

#### **7. Testing Plan**
1. Validate URL parameters persist across reloads.
2. Test puzzle interactivity on mobile/touch devices.
3. Ensure AI placeholder messages feel personalized.
4. Verify form data correctly generates the link and parameters are parsed accurately.

---

This blueprint balances simplicity with engagement, using Vue’s reactivity for smooth transitions and Pinia for state management. Start by building the Form → Teaser → Puzzle flow, then expand into dynamic storytelling!

---