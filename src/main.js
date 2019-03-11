import Vue from 'vue'
import App from './App.vue'
// import router from './router'
// import store from './store'
import VueTouch from 'vue-touch'
import BABYLON from 'babylonjs'
// import '@/components/shaftGlobalsComponents'
// import '@/directives/shaftGlobalsDirectives'

Vue.config.productionTip = false

Vue.use(VueTouch, { name: 'v-touch' })

new Vue({
  // router,
  // store,
  BABYLON,
  render: h => h(App)
}).$mount('#app')
