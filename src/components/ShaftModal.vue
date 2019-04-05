<template>
  <transition name="modal">
    <div class="modal-mask">  <!--@click="callback"-->
      <div class="modal-wrapper">
        <div class="modal-container"
             :class="type">
          <div class="modal-header">
            <slot name="header">
              <!--default header-->
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <!--default body-->
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <!--default footer-->
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'shaft-modal',
  props: {
    type: String
  },
  methods: {
    callback: function () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    opacity: 0.9;
  }

  .modal-container {
    width: 60%;
    height: 75%;
    margin: 0px auto;
    padding: 10px 15px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
  }

  @media screen and (max-width: 700px) {
    .modal-container {
      width: 91%;
      height: 99%;
    }
  }

  .modal-container-congratulations {
    width: 280px;
    height: auto;
    margin: 0px auto;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, .6);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-size: 16px;
    color: #ade6ff;
  }

  .modal-container-empty {
    max-width: 300px;
    width: 300px;
    height: auto;
    background-color: rgba(0, 0, 0, 0);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }

  .modal-header{
    position: relative;
    height: 0;
    z-index: 2;
  }

  .modal-footer{
    height: 0%;
    margin-top: 10px;
    color: #42b983;
  }
  .modal-body {
    position: relative;
    height: 99%;
    margin: 0;
    text-align: center;
  }

  .modal-default-button {
    float: right;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
