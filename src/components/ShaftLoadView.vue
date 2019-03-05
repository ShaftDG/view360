<template>
    <div id="MyLoadingScreenContainer" class="containerLoader" v-if="typeLoader === 'full'">
      <div id="MyLoadingScreen" class="loader"></div>
      <div id="MyLoadingScreenInner" class="loaderInner"></div>
      <div id="MyLoadingScreenInner1" class="loaderInner1"></div>
      <div class="progress">{{progressPercent}} %</div>
    </div>

    <div id="MyLoadingScreenContainerMini" class="containerLoaderMini" v-else-if="typeLoader === 'mini'">
      <div id="MyLoadingScreenMini" class="loaderMini"></div>
      <div id="MyLoadingScreenInnerMini" class="loaderInnerMini"></div>
      <div id="MyLoadingScreenInner1Mini" class="loaderInner1Mini"></div>
    </div>

</template>

<script>
export default {
  name: 'shaft-load-view',
  props: [ 'progressPercent', 'typeLoader' ]
}
</script>

<style scoped>
  .progress {
    width: 100%;
    text-align: center;
    color: #42c0ff;
    font-size: 24pt;
    font-family: Gill Sans Extrabold, fantasy;
  }

  .containerLoader {
    width: 100%;
    height: 100%;
    background-color: black;
    display: -webkit-flex; /* Safari */
    -webkit-align-items: center; /* Safari 7.0+ */
    display: flex;
    align-items: center;
  }

  .containerLoaderMini {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0);
    display: -webkit-flex; /* Safari */
    -webkit-align-items: center; /* Safari 7.0+ */
    display: flex;
    align-items: center;
  }

  .loaderMini {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 30px;
    height: 30px;
    margin: -30px 0 0 -30px;
    border: 6px solid rgba(0, 0, 0, 0);
    border-radius: 50%;
    border-top: 6px solid #00495b;
    border-left: 6px solid #00495b;
    border-bottom: 6px solid #00495b;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }

  .loader {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -75px 0 0 -75px;
    border: 16px solid rgba(0, 0, 0, 0);
    border-radius: 50%;
    border-top: 16px solid #00495b;
    border-left: 16px solid #00495b;
    border-bottom: 16px solid #00495b;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }

  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loaderInner {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -90px 0 0 -90px;
    border: 16px solid rgba(0, 0, 0, 0);
    border-radius: 50%;
    border-top: 16px solid #0083a4;
    border-left: 16px solid #0083a4;
    border-bottom: 16px solid #0083a4;
    width: 150px;
    height: 150px;
    -webkit-animation: spinInner 2s linear infinite;
    animation: spinInner 2s linear infinite;
  }

  .loaderInnerMini {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 16px;
    height: 16px;
    margin: -25px 0 0 -25px;
    border: 8px solid rgba(0, 0, 0, 0);
    border-radius: 50%;
    border-top: 8px solid #0083a4;
    border-left: 8px solid #0083a4;
    border-bottom: 8px solid #0083a4;

    -webkit-animation: spinInner 2s linear infinite;
    animation: spinInner 2s linear infinite;
  }

  @-webkit-keyframes spinInner {
    0% { -webkit-transform: rotate(360deg); }
    100% { -webkit-transform: rotate(0deg); }
  }

  @keyframes spinInner {
    0% { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
  }

  .loaderInner1 {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -105px 0 0 -105px;
    border: 16px solid rgba(0, 0, 0, 0);
    border-radius: 50%;
    border-top: 16px solid #00b3db;
    border-right: 16px solid #00b3db;
    border-bottom: 16px solid #00b3db;
    width: 180px;
    height: 180px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }

  .loaderInner1Mini {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 20px;
    height: 20px;
    margin: -23px 0 0 -23px;
    border: 4px solid rgba(0, 0, 0, 0);
    border-radius: 50%;
    border-top: 4px solid #00b3db;
    border-right: 4px solid #00b3db;
    border-bottom: 4px solid #00b3db;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }
</style>
