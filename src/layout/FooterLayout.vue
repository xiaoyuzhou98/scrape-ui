<template>
  <footer>
    <div class="box"><h1>Footer</h1></div>
  </footer>
</template>
<script>
export default {
  name: "FooterLayout",
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
footer {
  width: 100%;
  height: 2rem;
  background: #967e76;
  .box {
    width: 80vw;
    margin: 0 auto;
  }
}
@media screen and (max-width: 750px) {
}
</style>
