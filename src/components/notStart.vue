<template lang="html">
  <div class="noStart">
    Comming soon...
    <div class="temp">
      <img src="static/images/temp.gif">
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css" scope>
.noStart {
  position: relative;
  height: 80vh;
  text-align: center;
  font-size: 2.2rem;
}

.noStart::after {
  content: '';
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}

.temp img{
  max-width: 800px;
  min-width: 300px;
  width: 100%;
}

</style>
