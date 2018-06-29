<template lang="html">
  <div class="noStart">
    此帳號目前尚未驗證。
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

</style>
