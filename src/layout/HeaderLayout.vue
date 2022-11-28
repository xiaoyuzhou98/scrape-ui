<template>
  <header :class="{ changeColor: isChangeColor }">
    <nav>

    </nav>
  </header>
</template>
<script>
export default {
  name: "HeaderLayout",
  data() {
    return {
      isChangeColor: false,
      navActive: 0,
      navArr: [{ label: "Home", link: "/" }],
    };
  },
  watch: {
    $route(to, from) {
      if (from.matched.length && to.matched[0].path !== from.matched[0].path) {
        window.scrollTo(0, 0);
      }
      if (to.path == "/") {
        this.navActive = 0;
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.scrollingEvent);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollingEvent());
  },
  methods: {
    scrollingEvent() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      this.isChangeColor = scrollTop > 0;
    },
    toRoute(link, index) {
      this.$router.push(link);
      this.navActive = index;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  height: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  transition: all 1s;
  background-color: #C0C4CC;
  &.changeColor {
    background: #b7c4cf;
  }
  nav {
    width: 80vw;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
@media screen and (max-width: 750px) {
}
</style>
