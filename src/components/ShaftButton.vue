<template>
  <button class="normal"
    :class="type"
    :disabled="disabled"
    @click="callback($event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'shaft-button',
  props: {
    type: String,
    disabled: Boolean
  },
  methods: {
    callback: function (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>
  /*@import '../../public/css/fonts.css';*/
  button {
    width: 65%;
    min-width: 130px;
    margin-top: 7px;
    margin-right: 10px;
    margin-left: 10px;
    background-color: #4c95b1;
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0)), to(deepskyblue));
    background: -webkit-linear-gradient(top, rgba(0,0,0,0), deepskyblue);
    background: -moz-linear-gradient(top, rgba(0,0,0,0), deepskyblue);
    background: -ms-linear-gradient(top, rgba(0,0,0,0), deepskyblue);
    background: -o-linear-gradient(top, rgba(0,0,0,0), deepskyblue);
    background: linear-gradient(top, rgba(0,0,0,0), deepskyblue);
    border: 4px solid #ffffff;
    /*border-bottom: 1px solid #4c89a1;*/
    border-radius: 20px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    -ms-border-radius: 20px;
    -o-border-radius: 20px;
    box-shadow: inset 0 1px 0 0 #80c7d5;
    -webkit-box-shadow: 0 1px 0 0 #80c7d5 inset ;
    -moz-box-shadow: 0 1px 0 0 #80c7d5 inset;
    -ms-box-shadow: 0 1px 0 0 #80c7d5 inset;
    -o-box-shadow: 0 1px 0 0 #80c7d5 inset;
    color: white;
    font-size: 14pt;
    font-weight: bold;
    padding: 6px 10px;
    text-align: center;
    text-shadow: 0 0 10px #101921, 0 0 15px #0c2638;
  &[disabled]{
     cursor: not-allowed;
   }
  }

  @media screen and (max-width: 320px) {
    button {
      font-size: 12px;
    }
  }

  button:hover {
    /*opacity:.85;*/
    cursor: pointer;
    background: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0)), to(#00ffec));
    background: -webkit-linear-gradient(top, rgba(0,0,0,0), #00ffec);
    background: -moz-linear-gradient(top, rgba(0,0,0,0), #00ffec);
    background: -ms-linear-gradient(top, rgba(0,0,0,0), #00ffec);
    background: -o-linear-gradient(top, rgba(0,0,0,0), #00ffec);
    background: linear-gradient(top, rgba(0,0,0,0), #00ffec);

  }
  button:active {
    border: 4px solid #237491;
    box-shadow: 0 0 10px 5px #13476b inset;
    -webkit-box-shadow:0 0 10px 5px #13476b inset ;
    -moz-box-shadow: 0 0 10px 5px #13476b inset;
    -ms-box-shadow: 0 0 10px 5px #13476b inset;
    -o-box-shadow: 0 0 10px 5px #13476b inset;
  }
</style>
