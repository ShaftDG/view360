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
  button {
    width: 40%;
    min-width: 130px;
    margin-top: 10px;
    margin-right: 10px;
    margin-left: 10px;
    background-color: #4c95b1;
    background: -webkit-gradient(linear, left top, left bottom, from(#549db1), to(#447b91));
    background: -webkit-linear-gradient(top, #549db1, #447b91);
    background: -moz-linear-gradient(top, #549db1, #447b91);
    background: -ms-linear-gradient(top, #549db1, #447b91);
    background: -o-linear-gradient(top, #549db1, #447b91);
    background: linear-gradient(top, #549db1, #447b91);
    border: 1px solid #447b91;
    border-bottom: 1px solid #4c89a1;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    -o-border-radius: 3px;
    box-shadow: inset 0 1px 0 0 #80c7d5;
    -webkit-box-shadow: 0 1px 0 0 #80c7d5 inset ;
    -moz-box-shadow: 0 1px 0 0 #80c7d5 inset;
    -ms-box-shadow: 0 1px 0 0 #80c7d5 inset;
    -o-box-shadow: 0 1px 0 0 #80c7d5 inset;
    color: white;
    font-weight: bold;
    padding: 6px 10px;
    text-align: center;
    text-shadow: 0 0 10px #3da3c3;
  &[disabled]{
     cursor: not-allowed;
   }
  }
  button:hover {
    opacity:.85;
    cursor: pointer;
  }
  button:active {
    border: 1px solid #237491;
    box-shadow: 0 0 10px 5px #13476b inset;
    -webkit-box-shadow:0 0 10px 5px #13476b inset ;
    -moz-box-shadow: 0 0 10px 5px #13476b inset;
    -ms-box-shadow: 0 0 10px 5px #13476b inset;
    -o-box-shadow: 0 0 10px 5px #13476b inset;
  }
</style>
