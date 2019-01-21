<template>
  <div class="hello">
    <h2 v-if="showMsg">{{greeting}}</h2>
    <shaft-select
      :selected="location"
      :options="locations"
      @change="onChange"
    ></shaft-select>
    <!--<select v-model="selected" @change="onChange()">-->
      <!--<option-->
        <!--v-for="option in options"-->
        <!--v-bind:value="option.value"-->
        <!--:key="option.value">-->
        <!--{{ option.text }}-->
      <!--</option>-->
    <!--</select>-->
    <div>
     <h2>Choosen location: {{ location }}</h2>
     <!--<shaft-input v-model="greeting"></shaft-input>-->
     <shaft-button v-model="beginTest" @click="onStartTest">Begin test</shaft-button>
     <shaft-button v-model="endTest" @click="onEndTest">End test</shaft-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Main',
  props: [ 'numElements', 'resultTest', 'testMode', 'location', 'locations' ],
  data: function () {
    return {
      // greeting: this.resultTest + ' correct answers out of ' + this.numElements,
      beginTest: true,
      endTest: false
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
</style>
