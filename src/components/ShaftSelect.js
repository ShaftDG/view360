import Vue from 'vue'

Vue.component('shaft-select', {
  props: ['selected', 'options'],
  watch: {
    selected: function (val) {
      this.selected = val
    }
  },
  render: function (h) {
    if (this.options.length) {
      return h('select', {
        domProps: {
          value: this.selected
        },
        on: {
          change: event => {
            this.$emit('change', event.target.value)
          }
        }
      },
      this.options.map(function (option) {
        return h('option', {
          class: {},
          style: {},
          props: {},
          domProps: {
            value: option.value,
            text: option.text
          },
          attrs: {},
          on: {},
          nativeOn: {},
          directives: [],
          scopedSlots: {}
        })
      }))
    } else {
      return h('p', 'Ничего не найдено.')
    }
  }
})
