<template>
  <button class="normal"
    :class="type"
    :disabled="disabled"
    @click="callback($event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'shaft-button',
  props: {
    type: String,
    disabled: Boolean
  },
  methods: {
    callback: function (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>
  button {
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
