<template>
  <section class="page">
    <ul class="imageList" v-if="images.length">
      <li v-for="(image, index) in images" :key="index">
        <el-card shadow="hover">
          <div class="icon"></div>
          <div class="detail">
            <div>User: @{{ image.user }}</div>
            <div>
              <a :href="image.url" target="_blank">{{ image.url }}</a>
            </div>
            <el-button @click="openDialog(image)">预览</el-button>
            <el-button @click="open()">打开本地文件夹</el-button>
            <el-button v-if="image.isWaiting" @click="openDialog2(image)">生成视频</el-button>
          </div>
        </el-card>
      </li>
    </ul>
    <el-dialog :title="url" :visible.sync="dialogVisible" width="40%">
      <img :src="src" alt="" />
    </el-dialog>

    <el-dialog title="选项" :visible.sync="dialog2Visible" width="40%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="视频时长">
          <el-select v-model="form.duration" placeholder="请选择（可选）默认5s">
            <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景音乐">
          <input type="file" id="file" hidden @change="fileChange" accept=".mp3" />
          <el-input placeholder="添加背景音乐" v-model="form.bgm" class="input-with-select">
            <el-button slot="append" icon="el-icon-microphone" type="success" @click="btnChange"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="isStart" @click="start">生成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
const { shell } = window.require("electron");
export default {
  name: "Images",
  data() {
    return {
      // source: require("@/assets/videos/2.avi"),
      updatingList: JSON.parse(localStorage.getItem("updatingList")) || [],
      images: [],
      src: "",
      url: "",
      path: "",
      dialogVisible: false,
      dialog2Visible: false,
      updated: false,
      isStart: false,
      form: {
        duration: "",
        bgm: "",
        options: [
          {
            value: 10,
            label: "10s",
          },
          {
            value: 30,
            label: "30s",
          },
          {
            value: 60,
            label: "60S",
          },
        ],
      },
    };
  },
  async created() {
    await this.$api
      .getLocalImages()
      .then((res) => {
        const { images, path } = res;
        this.path = path;
        images.forEach((image) => {
          const data = {
            user: image.split("_")[0],
            url: `https://twitter.com/${image.split("_")[0]}/status/${image.split("_")[1].split(".")[0]}`,
            name: image,
            src: `${path}\\${image}`,
          };
          data.isWaiting = this.$utils.findObj(data, this.updatingList);
          this.images.push(data);
        });
      })
      .catch((e) => {
        this.$message({
          message: e,
          type: "error",
          duration: 4000,
        });
      });
  },
  methods: {
    openDialog(image) {
      this.dialogVisible = true;
      this.src = image.src;
      this.url = image.url;
    },
    openDialog2(image) {
      this.dialog2Visible = true;
      this.src = image.src;
      this.url = image.url;
    },
    async start() {
      this.isStart = true;
      const video = await this.$api.getTweetsVideo(this.url, this.form.duration,this.form.bgm);
      console.log("New tweet video saved: ", video);
      this.$message({
        message: `New tweet video saved: ${video}`,
        type: "success",
        duration: 4000,
      });
      this.updatingList = this.updatingList.filter((item) => {
        return item.url !== this.url;
      });
      localStorage.setItem("updatingList", JSON.stringify(this.updatingList));
      setTimeout(() => {
        this.isStart = false;
        location.reload();
      }, 2000);
    },
    open() {
      shell.openPath(this.path);
    },
    fileChange() {
      try {
        const fu = document.getElementById("file");
        if (fu == null) return;
        this.form.bgm = fu.files[0].path;
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
  width: 10rem;
  max-height: 9rem;
  margin: 0 auto;
  // overflow-y: scroll;

  ul {
    height: 100%;
    li {
      margin-bottom: 0.2rem;
      .el-card {
        height: 1.8rem;
        text-align: center;
        .el-card__body {
          .icon {
            width: 1.2rem;
            height: 1.2rem;
            float: left;
            background-color: grey;
          }
          .detail {
            width: calc(100% - 1.2rem);
            height: auto;
            float: left;
            div {
              margin-bottom: 0.15rem;
            }
            a:hover {
              color: rgba(0, 119, 255, 0.692);
            }
          }
        }
      }
    }
  }

  .el-dialog {
    img {
      width: 100%;
    }
  }
}
</style>
