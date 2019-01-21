<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" height="64px" width="64px"/>
    <Main
      :numElements="numElements"
      :resultTest="resultTest"
      :testMode="testMode"
      :location="location"
      :locations="locations"
      @selectedLocation="onChangeLocation"
      @onStartTest="onStartTest"
      @onEndTest="onEndTest"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Main from '@/components/Main.vue'

export default {
  name: 'home',
  components: {
    Main
  },
  props: [ 'location', 'locations', 'numElements', 'resultTest', 'testMode' ],
  methods: {
    onChangeLocation (value) {
      this.$emit('selectedLocation', value)
      // this.$parent.changeVisibleVUEView(true)
    },
    onStartTest (value) {
      this.$emit('onStartTest', value)
    },
    onEndTest (value) {
      this.$emit('onEndTest', value)
    }
  }
}
</script>
