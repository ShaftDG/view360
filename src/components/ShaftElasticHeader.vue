<template>
  <div class="draggable-header-view"
       @mousedown="startDrag" @touchstart="startDrag"
       @mousemove="onDrag" @touchmove="onDrag"
       @mouseup="stopDrag" @touchend="stopDrag" @mouseleave="stopDrag">
    <svg id="svgHeader" class="bg" width="100%" height="100%" ref="svgHeader" aria-hidden="true">
      <!--<defs>-->
        <!--<radialGradient id="grad"-->
                        <!--cx="50%" y="50%">-->
          <!--<stop offset="0%" stop-color="crimson"-->
                <!--class="stop-1"/>-->
          <!--<stop offset="49%" stop-color="gold"-->
                <!--class="stop-2"/>-->
          <!--<stop offset="50%" stop-color="lemonchiffon"-->
                <!--class="stop-2"/>-->
          <!--<stop offset="51%" stop-color="gold"-->
                <!--class="stop-2"/>-->
          <!--<stop offset="100%" stop-color="teal"-->
                <!--class="stop-3"/>-->
        <!--</radialGradient>-->
      <!--</defs>-->
      <path :d="headerPath" fill="#00A0A0" fill-opacity="0.5"></path>
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
      c: { x: 100, y: 100 },
      // record drag start point
      start: { x: 0, y: 0 },
      header: null
    }
  },
  watch: {
    startMove: function (val) {
      var evt = document.createEvent('MouseEvents')
      evt.initMouseEvent('mousedown', true, true, window,
        0, 0, 0, 50, 80, false, false, false, false, 0, null)
      this.header.dispatchEvent(evt)
      for (var i = 1; i < 501; i++) {
        var evt1 = document.createEvent('MouseEvents')
        evt1.initMouseEvent('mousemove', true, true, window,
          0, 0, 0, 50, 80 + i, false, false, false, false, 0, null)
        this.header.dispatchEvent(evt1)
      }
      var evt2 = document.createEvent('MouseEvents')
      evt2.initMouseEvent('mouseup', true, true, window,
        0, 0, 0, 50, 300, false, false, false, false, 0, null)


      this.header.dispatchEvent(evt2)
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
        this.header.style.transform = 'translateY(' + (dy / dampen * 0.5) + 'px)'
      }
    },
    stopDrag: function () {
      if (this.dragging) {
        this.dragging = false
        dynamics.animate(this.c, {
          x: this.parentWidth / 2,
          y: this.parentHeight
        }, {
          type: dynamics.spring,
          duration: 700,
          friction: 280
        })
        // console.log(this.header.children[0])
        dynamics.animate(this.header, {
          translateY: 0
        }, {
          type: dynamics.spring,
          duration: 700,
          friction: 280
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
    background-color: rgba(0,0,0,0.5);
    /*box-shadow: 0 4px 16px rgba(0,0,0,.15);*/
    width: 100%;
    height: 100%;
    /*overflow: hidden;*/
    margin: 30px auto;
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
