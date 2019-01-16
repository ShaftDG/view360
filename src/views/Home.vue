<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"/>
    <HelloWorld msg="Welcome to Your Vue.js App! Choose location." num="1234" :location=location @selectedLocation="onChangeLocation"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  props: [ 'location' ],
  methods: {
    onChangeLocation (value) {
      this.$emit('selectedLocation', value)
      // this.$parent.changeVisibleVUEView(true)
    }
  }
}
</script>
