<template>
  <div id="app">
    <PlayGround />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayGround from './views/play-ground/play-ground.vue';

@Component({
  components: {
    PlayGround,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

html,
body,
#app {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  margin: 0;
  padding: 0;
}
</style>
