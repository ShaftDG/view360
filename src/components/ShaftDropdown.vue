<template>
  <div class="btn-group">
    <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption !== undefined">
      {{ selectedOption }}
      <span class="caret"></span>
    </li>

    <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption === undefined">
      {{placeholderText}}
      <span class="caret"></span>
    </li>

    <transition name="slide-fade">
    <ul class="dropdown-menu" v-if="showMenu">
      <li v-for="option in options" :key="option.value">
        <a href="javascript:void(0)" @click="updateOption(option)">
          {{ option.text }}
        </a>
      </li>
    </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'shaft-dropdown',
  props: ['selected', 'options', 'placeholder'],
  data () {
    return {
      selectedOption: this.selected,
      showMenu: false,
      placeholderText: this.placeholder
    }
  },
  methods: {
    updateOption (option) {
      this.selectedOption = option.value
      this.showMenu = false
      this.$emit('updateOption', this.selectedOption)
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    }
  }
}
</script>

<style scoped>
  .btn-group {
    min-width: 160px;
    height: 40px;
    position: relative;
    margin: 10px 1px;
    display: inline-block;
    vertical-align: middle;
  }
  .btn-group a:hover {
    text-decoration: none;
  }
  .dropdown-toggle {
    color: #636b6f;
    min-width: 160px;
    padding: 10px;
    text-transform: none;
    font-weight: 300;
    margin-bottom: 7px;
    border: 0;
    background-image: linear-gradient(#009688, #009688), linear-gradient(#D2D2D2, #D2D2D2);
    background-size: 0 2px, 100% 1px;
    background-repeat: no-repeat;
    background-position: center bottom, center calc(100% - 1px);
    background-color: transparent;
    transition: background 0s ease-out;
    float: none;
    box-shadow: none;
    border-radius: 0;
  }
  .dropdown-toggle:hover {
    background: #e1e1e1;
    cursor: pointer;
  }
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    list-style: none;
    font-size: 14px;
    text-align: left;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    background-clip: padding-box;
    -webkit-transform-origin: center top;
    -moz-transform-origin: center top;
    -o-transform-origin: center top;
    -ms-transform-origin: center top;
    transform-origin: center top;
    animation-timing-function:ease-in-out;
  }
  .dropdown-menu > li > a {
    padding: 10px 30px;
    display: block;
    clear: both;
    font-weight: normal;
    line-height: 1.6;
    color: #333333;
    white-space: nowrap;
    text-decoration: none;
  }
  .dropdown-menu > li > a:hover {
    background: #efefef;
    color: #409FCB;
  }
  .dropdown-menu > li {
    overflow: hidden;
    width: 100%;
    position: relative;
    margin: 0;
  }
  .caret {
    display: relative;
    width: 0;
    position: relative;
    top: 10px;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid \9;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    float: right;
  }
  li {
    list-style: none;
  }

  .slide-fade-enter-active {
    /*transition: all .25s ease;*/
    animation: bounce-in 0.75s;
  }
  .slide-fade-leave-active {
    /*transition: all .25s ease;*/
    animation: bounce-in 0.75s reverse;
  }

  .slide-fade-enter {
    /*transform: perspective(1000px) rotateX(-90deg) scaleX(0.75);*/
    /*opacity: 0.5;*/
  }

  .slide-fade-enter-to {
    /*transform: perspective(1000px) rotateX(0deg) scaleX(1);*/
    /*opacity: 1;*/
  }

  .slide-fade-leave-to
    /* .slide-fade-leave-active до версии 2.1.8 */ {
    /*transform: perspective(1000px) rotateX(-90deg) scaleX(0.75);*/
    /*opacity: 0.5;*/
  }
  @keyframes bounce-in {
    0% {
      transform: perspective(1000px) rotateX(-90deg);
      opacity: 0.5;
    }
    25% {
      opacity: 1;
    }
    50% {
      transform: perspective(1000px) rotateX(10deg);
    }
    75% {
      transform: perspective(1000px) rotateX(-5deg);
    }
    100% {
      transform: perspective(1000px) rotateX(0deg);
    }
  }
</style>
