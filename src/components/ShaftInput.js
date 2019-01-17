import Vue from 'vue'

Vue.component('shaft-input', {
  props: ['value'],
  render: function (h) {
    return h('input', {
      class: {},
      style: {},
      props: {},
      domProps: {
        value: this.value
      },
      attrs: {},
      on: {
        input: event => {
          this.$emit('input', event.target.value)
        }
      },
      nativeOn: {},
      directives: [],
      scopedSlots: {}
    }, this.$slots.default)
  }
})
