<template>
  <section class="sideBar">
    <el-radio-group v-model="isCollapse" style="margin: 0.2rem">
      <el-radio-button :label="false" v-show="isCollapse">展开</el-radio-button>
      <el-radio-button :label="true" v-show="!isCollapse">收起</el-radio-button>
    </el-radio-group>
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-menu-item index="1" @click="toHome">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="2" @click="toImage">
        <i class="el-icon-picture-outline"></i>
        <span slot="title">图片</span>
      </el-menu-item>
      <el-menu-item index="3" @click="toVideo">
        <i class="el-icon-video-camera"></i>
        <span slot="title">视频</span>
      </el-menu-item>
      <el-menu-item index="4" @click="toSetting">
        <i class="el-icon-setting"></i>
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toHome() {
      this.$router.push("/");
    },
    toImage() {
      this.$router.push("/images");
    },
    toVideo() {
      this.$router.push("/videos");
    },
    toSetting() {
      this.$router.push("/setting");
    },
  },
};
</script>

<style lang="scss" scoped>
.sideBar {
  width: 11%;
  // height: 2rem;
  float: left;
  margin-top: 3rem;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
