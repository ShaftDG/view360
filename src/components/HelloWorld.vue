<template>
  <div class="hello">
    <h1>{{greeting}}</h1>
    <select v-model=selected @change="onChange()">
      <option v-for="option in options" v-bind:value="option.value" :key="option.value">
        {{ option.text }}
      </option>
    </select>
    <div>
     <h2>Choosen location: {{ selected }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: [ 'msg', 'num', 'location' ],
  data: function () {
    return {
      greeting: this.num + '. ' + this.msg,
      selected: this.location, // value
      options: [
        { text: 'scene1', value: 'scene1' },
        { text: 'scene2', value: 'scene2' },
        { text: 'scene3', value: 'scene3' },
        { text: 'scene4', value: 'scene4' },
        { text: 'scene5', value: 'scene5' },
        { text: 'scene6', value: 'scene6' },
        { text: 'scene7', value: 'scene7' }
      ]
    }
  },
  watch: {
    location: function (val) {
      this.selected = val
    }
  },
  methods: {
    onChange () {
      this.$emit('selectedLocation', this.selected)
      // console.log(11111111)
      // this.$parent.changeVisibleVUEView(true)
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
