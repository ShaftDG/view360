<template>
  <div class='container'>
    <!--<li @click='toggleMenu()' class='dropdown-toggle' v-if='selectedOption !== undefined'>-->
      <!--{{ selectedOption }}-->
      <!--<span class='caret'></span>-->
    <!--</li>-->

    <!--<li @click='toggleMenu()' class='dropdown-toggle' v-if='selectedOption === undefined'>-->
      <!--{{placeholderText}}-->
      <!--<span class='caret'></span>-->
    <!--</li>-->

    <!--<transition name='slide-fade'>-->
        <span v-for='option in options' :key='option.value'>
          <button href='javascript:void(0)' @click='updateOption(option)'>
            {{ option.text }}
          </button>
        </span>

    <!--</transition>-->
  </div>
</template>

<script>
export default {
  name: 'shaft-navbar',
  props: ['selected', 'options', 'placeholder'],
  data () {
    return {
      selectedOption: this.selected,
      showMenu: false,
      placeholderText: this.placeholder
    }
  },
  watch: {
    selected: function (val) {
      this.selectedOption = val
    }
  },
  methods: {
    updateOption (option) {
      if (this.selectedOption !== option.value) {
        this.selectedOption = option.value
        this.showMenu = false
        this.$emit('updateOption', this.selectedOption)
      }
    },
    toggleLable (e) {
      console.log(e.target.tagName)
      if (this.label === 'danger') {
        this.label = 'danger-changed'
      } else {
        this.label = 'danger'
      }
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    }
  }
}
</script>

<style scoped>
  .container {
    min-width: 160px;
    height: 40px;
    position: absolute;
    right: 0;
    margin: 10px 1px;
    vertical-align: middle;
  }

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
  &.selected {
     background-color: #ff4949;
     color: #fff;
   }
  }
</style>
