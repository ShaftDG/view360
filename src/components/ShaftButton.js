import Vue from 'vue'

Vue.component('shaft-button', {
  props: ['value'],
  render: function (h) {
    return h('button', {
      class: {},
      style: {},
      props: {},
      domProps: {},
      attrs: {},
      on: {
        click: event => {
          this.$emit('click', this.value)
        }
      },
      nativeOn: {},
      directives: [],
      scopedSlots: {}
    }, this.$slots.default)
  }
})
