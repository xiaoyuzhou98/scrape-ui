<template>
  <div class="app">
    <!-- <HeaderLayout /> -->
    <SideBar />
    <div class="content_box">
      <KeepAlive include="Home">
        <router-view />
      </KeepAlive>
    </div>
  </div>
</template>
<script>
// import HeaderLayout from "@/layout/HeaderLayout.vue";
import SideBar from "@/layout/SideBar.vue";
import { mapActions } from "vuex";
export default {
  components: { SideBar },
  data() {
    return { showLoading: true };
  },
  created() {
    this.updateConfig();
    // const { args, savePath } = await this.$api.updateConfig().catch((e) => {
    //   this.$message({
    //     message: "Access config failed,please restart the programme",
    //     type: "error",
    //     duration: 4000,
    //   });
    // });
    // const config = {
    //   proxy: args[0].split("=")[1],
    //   savePath: savePath,
    // };
    // this.setConfig(config);
    // this.form.proxy = res.args[0].split("=")[1];
    // this.form.savePath = res.savePath;
  },
  mounted() {
    this.resetRem();
    window.addEventListener("load", this.loadingAni);
    window.addEventListener("resize", this.resetRem);
  },
  beforeDestroy() {
    window.removeEventListener("load", this.loadingAni());
    window.removeEventListener("resize", this.resetRem());
  },
  methods: {
    ...mapActions(["updateConfig"]),
    loadingAni() {
      setTimeout(() => {
        this.showLoading = false;
      }, 1000);
    },
    resetRem() {
      const clientWidth = document.body.clientWidth;
      let rem = clientWidth > 1920 ? 100 : (clientWidth * 100) / 1920;
      document.getElementsByTagName("html")[0].style.fontSize = rem + "px";
    },
  },
};
</script>
<style lang="scss" scoped>
.content_box {
  float: left;
  // background-color: blue;
  padding-top: 1rem;
  width: 89%;
}
</style>
