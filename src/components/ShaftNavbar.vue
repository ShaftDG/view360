<template>
  <div class='container'>
    <svg id="svgHeader" class="bg" width="100%" height="100%" ref="svgHeader" aria-hidden="true">
      <linearGradient  id="grad"
                       x1="100%" y1="100%">
        <stop offset="30%" stop-color="deepskyblue"
              stop-opacity="1" class="stop-1"/>
        <stop offset="100%" stop-color="dodgerblue"
              stop-opacity="0" class="stop-2"/>
      </linearGradient >
      <path :d="headerPath" fill=url(#grad) stroke="white"  stroke-width="3"/>
    </svg>
   <div class="link"
          v-for='option in options'
          :key='option.value'
          v-bind:id='option.value'
          v-bind:ref='option.value'
          @click='updateOption(option)'
    >
       {{ option.text }}
    </div>
  </div>
</template>

<script>
import dynamics from 'dynamics.js'
export default {
  name: 'shaft-navbar',
  props: ['selected', 'options', 'placeholder'],
  data () {
    return {
      selectedOption: this.selected,
      placeholderText: this.placeholder,
      parentWidth: 320,
      parentHeight: 40,
      // quadratic bezier control point
      c: { x: 160, y: 100 },
      // record drag start point
      start: { x: 0, y: 0 },
      pathCells: {
        bathroom: 2,
        childroom: 2,
        kitchen: 2,
        livingroom: 2,
        scene1: 2,
        scene6: 2,
        scene7: 2
      }
    }
  },
  computed: {
    headerPath: function (val) {
      // return 'M0,0 L' + this.parentWidth + ',0 ' +
      //   this.parentWidth + ',' + this.parentHeight +
      //   ' Q' + this.c.x + ',' + this.c.y +
      //   ' 0,' + this.parentHeight
      // var string = 'M2 0 ' + this.pathCells.kitchen
      //
      // for (let key in this.$refs) {
      //   if (key !== 'svgHeader') {
      //     string += 'C 160 80, 320 80, 320 0'
      //     console.log(key)
      //   }
      // }
      return 'M2 2 C 0 ' + this.pathCells.scene1 + ', 160 ' + this.pathCells.scene1 + ', 160 2 ' +
      'C 160 ' + this.pathCells.livingroom + ', 320 ' + this.pathCells.livingroom + ', 320 2' +
      'C 320 ' + this.pathCells.kitchen + ', 480 ' + this.pathCells.kitchen + ', 480 2' +
      'C 480 ' + this.pathCells.childroom + ', 640 ' + this.pathCells.childroom + ', 640 2' +
      'C 640 ' + this.pathCells.bathroom + ', 800 ' + this.pathCells.bathroom + ', 800 2' +
      'C 800 ' + this.pathCells.scene6 + ', 960 ' + this.pathCells.scene6 + ', 960 2' +
      'C 960 ' + this.pathCells.scene7 + ', 1120 ' + this.pathCells.scene7 + ', 1120 2'
    }
  },
  watch: {
    selected: function (val) {
      // this.$refs[this.selectedOption][0].style.color = '#dfefff'
      if (this.selectedOption !== val) {
        var that = this
        let currentProperty = this.selectedOption
        let nextProperty = val
        dynamics.animate(this.pathCells, {
          [currentProperty.replace('-', '')]: 2,
          [nextProperty.replace('-', '')]: 80
        }, {
          type: dynamics.easeInOut,
          duration: 500,
          friction: 300,
          complete: function () {
            that.selectedOption = val
          }
        })
      }
      // this.selectedOption = val
      // this.$refs[this.selectedOption][0].style.color = '#0012ff'
    }
  },
  methods: {
    updateOption (option) {
      if (this.selectedOption !== option.value) {
        var that = this
        let currentProperty = this.selectedOption
        let nextProperty = option.value
        dynamics.animate(this.pathCells, {
          [currentProperty.replace('-', '')]: 2,
          [nextProperty.replace('-', '')]: 80
        }, {
          type: dynamics.easeInOut,
          duration: 500,
          friction: 300,
          complete: function () {
            that.selectedOption = option.value
            that.$emit('updateOption', that.selectedOption)
          }
        })
        // this.pathCells[currentProperty.replace('-', '')] = 2
        // this.pathCells[nextProperty.replace('-', '')] = 80
        // this.$refs[this.selectedOption][0].style.color = '#dfefff'
        // this.selectedOption = option.value
        // this.$refs[this.selectedOption][0].style.color = '#0012ff'
      }
    }
  },
  mounted () {
    // this.$refs[this.selectedOption][0].style.color = '#0012ff'
    let currentProperty = this.selectedOption
    this.pathCells[currentProperty.replace('-', '')] = 80
    this.parentWidth = this.$refs.svgHeader.clientWidth
    // console.log(this.pathCells)
  }
}
</script>

<style scoped>
  .container {
    min-width: 160px;
    height: 100px;
    position: absolute;
    right: 0;
    padding: 0px;
    margin: 20px;
    vertical-align: middle;
  }

  .bg {
    position: absolute;
    /*top: 0;*/
    /*left: 0;*/
    z-index: 0;
    display: flex;
    align-items: center;
  }

  .link {
    position: relative;
    float:left;
    width: 160px;
    /*background-color: aqua;*/
    padding: 10px 0 0 0;
    font-size: 24px;
    font-family: '微软雅黑',arail;
    cursor: pointer;
    text-shadow: 0 0 10px #101921, 0 0 15px #0c2638;
    text-align: center;
    color: #dfefff;
    z-index: 9999;
  }
</style>
