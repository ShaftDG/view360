<template>
  <div class="hello">
    <h1>{{greeting}}</h1>
    <shaft-select :selected="location" :options="locations" @change="onChange"></shaft-select>
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
     <shaft-input v-model="greeting"></shaft-input>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  props: [ 'msg', 'num', 'location', 'locations' ],
  data: function () {
    return {
      greeting: this.num + '. ' + this.msg
    }
  },
  methods: {
    onChange (value) {
      this.$emit('selectedLocation', value)
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
