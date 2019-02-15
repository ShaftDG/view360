<template>
  <div class="draggable-header-view"
       @mousedown="startDrag" @touchstart="startDrag"
       @mousemove="onDrag" @touchmove="onDrag"
       @mouseup="stopDrag" @touchend="stopDrag" @mouseleave="stopDrag">
    <svg id="svgHeader" class="bg" width="100%" height="100%" ref="svgHeader" aria-hidden="true">
      <!--<defs>-->
        <radialGradient  id="grad"
                         cx="50%" cy="0%" r="500%">
          <stop offset="5%" stop-color="deepskyblue"
                class="stop-2"/>
          <stop offset="10%" stop-color="dodgerblue"
                class="stop-3"/>
        </radialGradient >
      <!--</defs>-->
      <path :d="headerPath" fill=url(#grad) fill-opacity="0.5"></path>
    </svg>
    <div class="header" ref="header">
      <slot name="header"></slot>
    </div>
    <div class="content" :style="contentPosition">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import dynamics from 'dynamics.js'

export default {
  name: 'shaft-elastic-header',
  props: ['startMove'],
  data: function () {
    return {
      dragging: false,
      parentWidth: 320,
      parentHeight: 100,
      // quadratic bezier control point
      c: { x: 160, y: 100 },
      // record drag start point
      start: { x: 0, y: 0 },
      header: null
    }
  },
  watch: {
    startMove: function (val) {
      this.dragging = true
      var that = this
      dynamics.animate(this.c, {
        x: this.parentWidth / 2,
        y: 200
      }, {
        type: dynamics.easeOut,
        duration: 200,
        friction: 450,
        complete: function () {
          that.stopDrag()
        },
        change: function () {
          that.header.style.transform = 'translateY(' + (0.5 * (that.c.y - that.parentHeight)) + 'px)'
        }
      })
    }
  },
  mounted () {
    this.parentWidth = this.$refs.svgHeader.clientWidth
    this.header = this.$refs.header
    // this.parentHeight = this.$refs.svgHeader.clientHeight
  },
  computed: {
    headerPath: function () {
      return 'M0,0 L' + this.parentWidth + ',0 ' +
        this.parentWidth + ',' + this.parentHeight +
        ' Q' + this.c.x + ',' + this.c.y +
        ' 0,' + this.parentHeight
    },
    contentPosition: function () {
      var dy = this.c.y - this.parentHeight
      var dampen = dy > 0 ? 2 : 4
      return {
        transform: 'translate3d(0,' + dy / dampen + 'px,0)'
      }
    }
  },
  methods: {
    startDrag: function (e) {
      e = e.changedTouches ? e.changedTouches[0] : e
      this.dragging = true
      this.start.x = e.pageX
      this.start.y = e.pageY
    },
    onDrag: function (e) {
      e = e.changedTouches ? e.changedTouches[0] : e
      if (this.dragging) {
        this.c.x = (this.parentWidth / 2) + (e.pageX - this.start.x)
        // dampen vertical drag by a factor
        var dy = e.pageY - this.start.y
        var dampen = dy > 0 ? 1.5 : 4
        this.c.y = this.parentHeight + dy / dampen
        this.header.style.transform = 'translateY(' + (0.5 * dy / dampen) + 'px)'
      }
    },
    stopDrag: function () {
      if (this.dragging) {
        this.dragging = false
        dynamics.animate(this.c, {
          x: this.parentWidth / 2,
          y: this.parentHeight
        }, {
          type: dynamics.gravity,
          duration: 500,
          friction: 300
        })
        // console.log(this.header.children[0])
        dynamics.animate(this.header, {
          translateY: 0
        }, {
          type: dynamics.gravity,
          duration: 500,
          friction: 300
        })
        // this.header.style.top = '0'
      }
    }
  }
}
</script>

<style scoped>
  h1 {
    font-weight: 300;
    font-size: 3.2em;
    margin-top: 0;
  }
  a {
    color: #fff;
  }
  .draggable-header-view {
    background-color: rgba(0,0,0,0.0);
    /*box-shadow: 0 4px 16px rgba(0,0,0,.15);*/
    width: 100%;
    height: 100%;
    /*overflow: hidden;*/
    margin: 0px auto;
    position: relative;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    color: #fff;
    font-size: 14px;
    font-weight: 300;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .draggable-header-view .bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }

  .draggable-header-view .header, .draggable-header-view .content {
    position: relative;
    z-index: 1;
    padding: 30px;
    box-sizing: border-box;
  }
  .draggable-header-view .header {
    height: 80px;
  }
  .draggable-header-view .content {
    color: #333;
    line-height: 1.5em;
  }
</style>
