<template>
  <select :value="selectedValue" @change="callback($event)">
  <option
    v-for="option in options"
    v-bind:value="option.value"
    :key="option.value">{{ option.text }}</option>
  </select>
</template>

<script>
export default {
  name: 'shaft-select',
  props: ['selected', 'options'],
  computed: {
    selectedValue: function () {
      return this.selected
    }
  },
  methods: {
    callback: function (e) {
      this.$emit('change', e.target.value)
    }
  }
}
</script>

<style scoped>
  select {
    padding: 5px 30px;
    margin: 10px;
    border: 1px solid #ddd;
    color: #333;
    background-color:#fff;
    border-radius: 4px;
    font-size: 14px;
    font-family: '微软雅黑',arail;
    cursor: pointer;
  &[disabled]{
     cursor: not-allowed;
   }
  &.danger {
     background-color: #ff4949;
     color: #fff;
   }
  &.success {
     background-color: #13ce66;
     color: #fff;
   }
  &.info {
     background-color: #50bfff;
     color: #fff;
   }
  }
</style>
