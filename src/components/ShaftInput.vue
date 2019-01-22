<template>
  <input
    :value="value"
    @input="callback($event)"
  >
</template>

<script>
export default {
  name: 'shaft-input',
  props: ['value'],
  methods: {
    callback: function (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style scoped>

</style>
