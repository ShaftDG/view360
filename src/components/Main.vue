<template>
  <div>
    <!--<span>{{msg}}</span>-->
    <!--<shaft-select-->
      <!--:selected="location"-->
      <!--:options="locations"-->
      <!--@change="onChange($event)"-->
    <!--&gt;</shaft-select>-->
    <div>
     <!--<shaft-input v-model="msg"></shaft-input>-->
     <p v-if="showMsg">{{greeting}}</p>
     <!--<shaft-button @click="onStartTest(true)">Begin test</shaft-button>-->
     <!--<shaft-button @click="onEndTest(false)">End test</shaft-button>-->
      <!--<shaft-dropdown :options="locations"-->
                <!--:selected="location"-->
                <!--@updateOption="onChange($event)"-->
                <!--:placeholder="'Select an Item'">-->
      <!--</shaft-dropdown>-->
      <shaft-navbar :options="locations"
                      :selected="location"
                      @updateOption="onChange($event)"
                      :placeholder="'Select an Item'">
      </shaft-navbar>
    </div>
  </div>
</template>

<script>

import ShaftNavbar from './ShaftNavbar'
export default {
  name: 'Main',
  components: { ShaftNavbar },
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
