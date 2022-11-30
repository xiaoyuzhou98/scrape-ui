<template>
  <div class="page">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item class="user" label="ip地址">
        <el-input v-model="form.proxy" placeholder="配置代理ip地址" @keyup.native.enter="save" :disabled="!isEdit"></el-input>
      </el-form-item>

      <el-form-item label="保存路径">
        <input type="file" id="file" hidden @change="fileChange" webkitdirectory :disabled="!isEdit" />
        <el-input placeholder="请选择" v-model="form.savePath" class="input-with-select" :disabled="!isEdit">
          <el-button slot="append" icon="el-icon-folder" type="success" @click="btnChange"></el-button>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="isEdit = true" v-if="!isEdit" :disabled="isLaunch">修改</el-button>
        <el-button @click="save"  v-else>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Setting",
  data() {
    return {
      form: {
        proxy: "",
        savePath: "",
      },
      isEdit: false,
    };
  },
  computed: {
    ...mapGetters(["getConfig", "isLaunch"]),
  },
  watch: {
    getConfig: {
      handler(newVal) {
        this.form.proxy = newVal.proxy;
        this.form.savePath = newVal.savePath;
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    ...mapActions(["updateConfig"]),
    save() {
      this.isEdit = false;
      this.updateConfig({ proxy: this.form.proxy, savePath: this.form.savePath });
    },
    fileChange() {
      try {
        const fu = document.getElementById("file");
        if (fu == null) return;
        const f = fu.files[0].path;
        this.form.savePath = f.split("\\").slice(0, -1).join("\\");
      } catch (error) {
        console.debug("choice file err:", error);
      }
    },
    btnChange() {
      var file = document.getElementById("file");
      file.click();
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: 8rem;
  margin: 0 auto;
  margin-top: 3rem;
  span {
    font-size: 0.2rem;
    color: #000;
  }
  .el-button {
    margin: 0 0.2rem;
  }
}
</style>
