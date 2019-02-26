<template>
  <div v-if="typeMenu === 'vertical'">
    <v-touch :enabled="isEnabledTouch"
             @panstart="onPanStart"
             @pandown="onPanDown"
             @panup="onPanUp"
             :swipe-options="{ threshold: 5 }">
      <div style="overflow: hidden;">
        <div class='container-menu' @click='changeMenu()'>
          <svg id="svgMenu" class="bg" width="100%" height="100%" ref="svgMenu" aria-hidden="true">
            <path :d="menuPath1" stroke="white" stroke-linecap="round" stroke-width="4"/>
            <path :d="menuPath2" stroke="white" stroke-linecap="round" stroke-width="4"/>
            <path :d="menuPath3" stroke="white" stroke-linecap="round" stroke-width="4"/>
          </svg>
        </div>
        <div class='container-vertical' ref='containerVertical'>
          <svg id="svgHeader" class="bg" width="100%" height="352px" ref="svgHeader" aria-hidden="true">
            <linearGradient  id="grad"
                             x1="0%" y1="0%">
              <stop offset="40%" stop-color="deepskyblue"
                    stop-opacity="1" class="stop-1"/>
              <stop offset="50%" stop-color="deepskyblue"
                    stop-opacity="1" class="stop-2"/>
              <stop offset="100%" stop-color="dodgerblue"
                    stop-opacity="0" class="stop-3"/>
            </linearGradient >
            <path :d="headerPathVertical" class="path" ref="path" fill=transparent stroke="white" stroke-linecap="round" stroke-width="4"/>
          </svg>
          <transition
            name="slide-fade"
            @before-enter="beforeEnter"
          >
            <div v-if="showMenu" ref="stringMenu">
              <div class="link-vertical"
                   v-for='option in options'
                   :key='option.value'
                   v-bind:id='option.value'
                   v-bind:ref='option.value'
                   @click='updateOption(option)'
              >
                {{ option.text }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </v-touch>
  </div>
  <div v-else-if="typeMenu === 'horizontal'">
    <div class='container-horizontal' ref='containerHorizontal'>
      <svg id="svgHeader" class="bg" width="100%" height="80px" ref="svgHeader" aria-hidden="true">
      <linearGradient  id="grad"
      x1="100%" y1="100%">
      <stop offset="30%" stop-color="deepskyblue"
      stop-opacity="1" class="stop-1"/>
      <stop offset="100%" stop-color="dodgerblue"
      stop-opacity="0" class="stop-2"/>
      </linearGradient >
      <path :d="headerPathHorizontal" fill=url(#grad) stroke="white"  stroke-linecap="round" stroke-width="4"/>
      </svg>
      <div class="link-horizontal"
           v-for='option in options'
           :key='option.value'
           v-bind:id='option.value'
           v-bind:ref='option.value'
           @click='updateOption(option)'
      >
        {{ option.text }}
      </div>
    </div>
  </div>
  <div v-else>
    set the menu type VERTICAL or HORIZONTAL
  </div>
</template>

<script>
import dynamics from 'dynamics.js'
export default {
  name: 'shaft-navbar',
  props: ['typeMenu', 'selected', 'options'],
  data () {
    return {
      showMenu: false,
      selectedOption: this.selected,
      pathCellsHorizontal: {
        bathroom: 2,
        childroom: 2,
        kitchen: 2,
        livingroom: 2,
        scene1: 2,
        scene6: 2,
        scene7: 2
      },
      menuClosed: true,
      resolutionSwitching: true,
      menuProperties: {
        line1: { x: 30, y: 4, x1: 4, y1: 4 },
        line2: { x: 30, y: 17, x1: 4, y1: 17 },
        line3: { x: 30, y: 30, x1: 4, y1: 30 }
      },
      menuPositionY: 0,
      isEnabledTouch: false,
      panStart: 0,
      pathCellsVertical: {
        bathroom: 148,
        childroom: 148,
        kitchen: 148,
        livingroom: 148,
        scene1: 148,
        scene6: 148,
        scene7: 148
      }
    }
  },
  computed: {
    headerPathHorizontal: function () {
      return 'M2 2 C 0 ' + this.pathCellsHorizontal.scene1 + ', 160 ' + this.pathCellsHorizontal.scene1 + ', 160 2 ' +
      'C 160 ' + this.pathCellsHorizontal.livingroom + ', 320 ' + this.pathCellsHorizontal.livingroom + ', 320 2' +
      'C 320 ' + this.pathCellsHorizontal.kitchen + ', 480 ' + this.pathCellsHorizontal.kitchen + ', 480 2' +
      'C 480 ' + this.pathCellsHorizontal.childroom + ', 640 ' + this.pathCellsHorizontal.childroom + ', 640 2' +
      'C 640 ' + this.pathCellsHorizontal.bathroom + ', 800 ' + this.pathCellsHorizontal.bathroom + ', 800 2' +
      'C 800 ' + this.pathCellsHorizontal.scene6 + ', 960 ' + this.pathCellsHorizontal.scene6 + ', 960 2' +
      'C 960 ' + this.pathCellsHorizontal.scene7 + ', 1120 ' + this.pathCellsHorizontal.scene7 + ', 1120 2'
    },
    menuPath1: function () {
      return 'M' + this.menuProperties.line1.x + ' ' + this.menuProperties.line1.y + ' L ' + this.menuProperties.line1.x1 + ' ' + this.menuProperties.line1.y1
    },
    menuPath2: function () {
      return 'M' + this.menuProperties.line2.x + ' ' + this.menuProperties.line2.y + ' L ' + this.menuProperties.line2.x1 + ' ' + this.menuProperties.line2.y1
    },
    menuPath3: function () {
      return 'M' + this.menuProperties.line3.x + ' ' + this.menuProperties.line3.y + ' L ' + this.menuProperties.line3.x1 + ' ' + this.menuProperties.line3.y1
    },
    headerPathVertical: function () {
      return 'M148 3 ' +
        'L ' + this.calculateMiddlePoint(this.pathCellsVertical.scene1) + ' 3' +
        'C ' + this.pathCellsVertical.scene1 + ' 0, ' + this.pathCellsVertical.scene1 + ' 50, ' + this.calculateMiddlePoint(this.pathCellsVertical.scene1) + ' 50 ' +
        'L 148 50' +
        'L ' + this.calculateMiddlePoint(this.pathCellsVertical.livingroom) + ' 50' +
        'C ' + this.pathCellsVertical.livingroom + ' 50, ' + this.pathCellsVertical.livingroom + ' 100, ' + this.calculateMiddlePoint(this.pathCellsVertical.livingroom) + ' 100' +
        'L 148 100' +
        'L ' + this.calculateMiddlePoint(this.pathCellsVertical.kitchen) + ' 100' +
        'C ' + this.pathCellsVertical.kitchen + ' 100, ' + this.pathCellsVertical.kitchen + ' 150, ' + this.calculateMiddlePoint(this.pathCellsVertical.kitchen) + ' 150' +
        'L 148 150' +
        'L ' + this.calculateMiddlePoint(this.pathCellsVertical.childroom) + ' 150' +
        'C ' + this.pathCellsVertical.childroom + ' 150, ' + this.pathCellsVertical.childroom + ' 200, ' + this.calculateMiddlePoint(this.pathCellsVertical.childroom) + ' 200' +
        'L 148 200' +
        'L ' + this.calculateMiddlePoint(this.pathCellsVertical.bathroom) + ' 200' +
        'C ' + this.pathCellsVertical.bathroom + ' 200, ' + this.pathCellsVertical.bathroom + ' 250, ' + this.calculateMiddlePoint(this.pathCellsVertical.bathroom) + ' 250' +
        'L 148 250' +
        'L ' + this.calculateMiddlePoint(this.pathCellsVertical.scene6) + ' 250' +
        'C ' + this.pathCellsVertical.scene6 + ' 250, ' + this.pathCellsVertical.scene6 + ' 300, ' + this.calculateMiddlePoint(this.pathCellsVertical.scene6) + ' 300' +
        'L 148 300' +
        'L ' + this.calculateMiddlePoint(this.pathCellsVertical.scene7) + ' 300' +
        'C ' + this.pathCellsVertical.scene7 + ' 300, ' + this.pathCellsVertical.scene7 + ' 350, ' + this.calculateMiddlePoint(this.pathCellsVertical.scene7) + ' 350' +
        'L 148 350'
    }
  },
  watch: {
    selected: function (val) {
      // this.$refs[this.selectedOption][0].style.color = '#dfefff'
      if (this.selectedOption !== val) {
        var that = this
        let currentProperty = this.selectedOption
        let nextProperty = val
        if (this.typeMenu === 'horizontal') {
          dynamics.animate(this.pathCellsHorizontal, {
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
        } else if (this.typeMenu === 'vertical') {
          dynamics.animate(this.pathCellsVertical, {
            [currentProperty.replace('-', '')]: 148,
            [nextProperty.replace('-', '')]: 2
          }, {
            type: dynamics.easeInOut,
            duration: 500,
            friction: 300,
            complete: function () {
              that.selectedOption = val
            }
          })
        }
      }
      // this.selectedOption = val
      // this.$refs[this.selectedOption][0].style.color = '#0012ff'
    },
    typeMenu: function (val) {
      let currentProperty = this.selectedOption
      if (this.typeMenu === 'horizontal') {
        for (let i in this.pathCellsHorizontal) {
          this.pathCellsHorizontal[i] = 2
        }
        this.pathCellsHorizontal[currentProperty.replace('-', '')] = 80
      } else if (this.typeMenu === 'vertical') {
        this.menuClosed = false
        this.changeMenu()
        for (let i in this.pathCellsVertical) {
          this.pathCellsVertical[i] = 148
        }
        this.pathCellsVertical[currentProperty.replace('-', '')] = 2
      }
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transform = 'translateY(' + this.menuPositionY + 'px)'
    },
    calculateMiddlePoint (value) {
      return ((value + 33) < 148 ? value + 33 : 148)
    },
    swipe (val) {
      this.$refs.stringMenu.style.transform = 'translateY(' + val + 'px)'
      this.$refs.svgHeader.style.transform = 'translateY(' + val + 'px)'
    },
    onPanStart () {
      this.panstart = this.menuPositionY
    },
    onPanDown (event) {
      if (this.menuPositionY < 0) {
        this.menuPositionY = event.deltaY + this.panstart
      } else {
        this.menuPositionY = 0
      }
      this.swipe(this.menuPositionY)
    },
    onPanUp (event) {
      if (this.menuPositionY > -200) {
        this.menuPositionY = event.deltaY + this.panstart
      } else {
        this.menuPositionY = -200
      }
      this.swipe(this.menuPositionY)
    },
    changeMenu () {
      var that = this
      if (this.menuClosed) {
        if (this.$refs.containerVertical.clientHeight > screen.height * 0.8) {
          this.isEnabledTouch = true
        } else {
          this.isEnabledTouch = false
        }
        this.$refs.containerVertical.style.right = '0'
        dynamics.animate(this.menuProperties.line1, {
          y: 30
        }, {
          type: dynamics.easeInOut,
          duration: 500,
          friction: 300
        })
        dynamics.animate(this.menuProperties.line3, {
          y: 4
        }, {
          type: dynamics.easeInOut,
          duration: 500,
          friction: 300
        })
        dynamics.animate(this.menuProperties.line2, {
          x: 30,
          x1: 30
        }, {
          type: dynamics.easeInOut,
          duration: 200,
          friction: 200,
          complete: function () {
            that.showMenu = true
            let currentProperty = that.selectedOption
            dynamics.animate(that.pathCellsVertical, {
              [currentProperty.replace('-', '')]: 2
            }, {
              type: dynamics.easeInOut,
              duration: 300,
              friction: 300,
              delay: 350,
              change: function (el, progress) {
                if (progress > 0) {
                  that.$refs.path.style.fill = 'url(#grad)'
                }
              }
            })
            that.$refs.path.classList.remove('close')
            that.$refs.path.classList.add('open')
            dynamics.animate(that.menuProperties.line2, {
              y: 45,
              y1: 45
            }, {
              type: dynamics.easeIn,
              duration: 200,
              friction: 200
            })
          }
        })
      } else {
        this.isEnabledTouch = false
        let currentProperty = this.selectedOption
        dynamics.animate(this.pathCellsVertical, {
          [currentProperty.replace('-', '')]: 148
        }, {
          type: dynamics.easeInOut,
          duration: 300,
          friction: 300,
          complete: function () {
            that.$refs.path.classList.remove('open')
            that.$refs.path.classList.add('close')
            that.$refs.path.style.fill = 'transparent'
            that.showMenu = false
            dynamics.animate(that.menuProperties.line1, {
              y: 4
            }, {
              type: dynamics.easeInOut,
              duration: 500,
              friction: 300
            })
            dynamics.animate(that.menuProperties.line3, {
              y: 30
            }, {
              type: dynamics.easeInOut,
              duration: 500,
              friction: 300
            })
            dynamics.animate(that.menuProperties.line2, {
              y: 17,
              y1: 17
            }, {
              type: dynamics.easeInOut,
              duration: 250,
              friction: 300,
              delay: 100,
              complete: function () {
                dynamics.animate(that.menuProperties.line2, {
                  x: 30,
                  x1: 4
                }, {
                  type: dynamics.easeInOut,
                  duration: 250,
                  friction: 300
                })
                that.$refs.containerVertical.style.right = '-200px'
              }
            })
          }
        })
      }
      this.menuClosed = !this.menuClosed
    },
    updateOption (option) {
      if (this.selectedOption !== option.value && this.resolutionSwitching) {
        var that = this
        this.resolutionSwitching = false
        let currentProperty = this.selectedOption
        let nextProperty = option.value
        if (this.typeMenu === 'horizontal') {
          dynamics.animate(this.pathCellsHorizontal, {
            [currentProperty.replace('-', '')]: 2,
            [nextProperty.replace('-', '')]: 80
          }, {
            type: dynamics.easeInOut,
            duration: 500,
            friction: 300,
            complete: function () {
              that.selectedOption = option.value
              that.$emit('updateOption', that.selectedOption)
              that.resolutionSwitching = true
            }
          })
        } else if (this.typeMenu === 'vertical') {
          let index = this.options.findIndex(x => x.value === nextProperty)
          let h = index * 50
          if (h > screen.height * 0.3 && that.$refs.containerVertical.clientHeight > screen.height * 0.8) {
            let hx = h - 100
            this.menuPositionY = -hx
            dynamics.animate(that.$refs.stringMenu, {
              translateY: -hx
            }, {
              type: dynamics.easeInOut,
              duration: 500,
              friction: 300
            })
            dynamics.animate(that.$refs.svgHeader, {
              translateY: -hx
            }, {
              type: dynamics.easeInOut,
              duration: 500,
              friction: 300
            })
          } else {
            var matrix = new WebKitCSSMatrix(that.$refs.stringMenu.style.webkitTransform)
            if (matrix.m42 !== 0) {
              dynamics.animate(that.$refs.stringMenu, {
                translateY: 0
              }, {
                type: dynamics.easeInOut,
                duration: 500,
                friction: 300
              })
              dynamics.animate(that.$refs.svgHeader, {
                translateY: 0
              }, {
                type: dynamics.easeInOut,
                duration: 500,
                friction: 300
              })
            }
          }
          dynamics.animate(this.pathCellsVertical, {
            [currentProperty.replace('-', '')]: 148,
            [nextProperty.replace('-', '')]: 2
          }, {
            type: dynamics.easeInOut,
            duration: 500,
            friction: 300,
            complete: function () {
              that.selectedOption = option.value
              that.$emit('updateOption', that.selectedOption)
              that.resolutionSwitching = true
            }
          })
        }
      }
    }
  },
  mounted () {
    let currentProperty = this.selectedOption
    this.pathCellsHorizontal[currentProperty.replace('-', '')] = 80
  }
}
</script>

<style scoped>
  .container-horizontal {
    min-width: 160px;
    height: 50px;
    position: absolute;
    right: 0;
    padding: 0px;
    margin: 20px;
    vertical-align: middle;
  }

  .container-vertical {
    width: 150px;
    height: 350px;
    position: absolute;
    right: -200px;
    padding: 2px;
    margin: 50px 10px 20px 20px;
    vertical-align: middle;
    clip-path: polygon(0% 0%, 100% 0%, 0% 100%, 100% 0%, 100% 100%, 0% 100%);
  }

  .container-menu:hover {
    cursor: pointer;
  }

  .container-menu {
    width: 30px;
    height: 50px;
    position: absolute;
    right: 0;
    padding: 0 4px 0 0;
    margin: 10px 10px 10px 10px;
    vertical-align: middle;
  }

  .bg {
    position: absolute;
    /*top: 0;*/
    /*left: 0;*/
    right: 0;
    height: 130%;
    z-index: 0;
    display: flex;
    align-items: center;
    overflow-x:hidden;
    overflow-y:auto;
  }

  .link-horizontal {
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

  .link-vertical {
    position: relative;
    float:left;
    height: 50px;
    width: 100%;
    font-size: 24px;
    font-family: '微软雅黑',arail;
    cursor: pointer;
    text-shadow: 0 0 10px #101921, 0 0 15px #0c2638;
    text-align: right;
    top: 0.375em;
    right: 20px;
    color: #dfefff;
    z-index: 9999;
  }

  .path {
    stroke-dasharray: 680;
    stroke-dashoffset: 680;
  }

  .open {
    animation: dash-in 0.6s linear;
    animation-fill-mode: forwards;
  }

  .close {
    animation: dash-out 0.6s linear;
    animation-fill-mode: forwards;
  }

  @keyframes dash-out {
    0% {
      stroke-dashoffset: 0;
    }

    40% {
      stroke-dashoffset: 680;
    }

    100% {
      stroke-dashoffset: 680;
    }

  }

  @keyframes dash-in {
    0% {
      stroke-dashoffset: 680;
    }

    40% {
      stroke-dashoffset: 680;
    }

    100% {
      stroke-dashoffset: 0;
    }

  }

  .slide-fade-enter-active {
    animation: bounce-in 0.85s;
  }
  .slide-fade-leave-active {
    animation: bounce-in 0.25s reverse;
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
    }
    75% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
