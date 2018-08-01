<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  background: fixed no-repeat url("../static/images/bg_login.jpg");
  background-size: cover;
  background-position: center;
  color: #f8f8f9;
  overflow: hidden;
}

</style>
