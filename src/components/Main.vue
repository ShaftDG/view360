<template>
  <div class="hello">
    <span>{{msg}}</span>
    <shaft-select
      :selected="location"
      :options="locations"
      @change="onChange($event)"
    ></shaft-select>
    <div>
     <!--<shaft-input v-model="msg"></shaft-input>-->
     <p v-if="showMsg">{{greeting}}</p>
     <shaft-button @click="onStartTest(true)">Begin test</shaft-button>
     <shaft-button @click="onEndTest(false)">End test</shaft-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Main',
  props: [ 'numElements', 'resultTest', 'testMode', 'location', 'locations' ],
  data: function () {
    return {
      beginTest: true,
      endTest: false,
      msg: 'Choosen location:'
    }
  },
  computed: {
    greeting: function () {
      return this.resultTest + ' correct answers out of ' + this.numElements
    },
    showMsg: function () {
      return this.testMode
    }
  },
  methods: {
    onChange (value) {
      this.$emit('selectedLocation', value)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
span, p {
  color: #fff;
  font-size: 24px;
  font-family: '微软雅黑', arail
}
</style>
