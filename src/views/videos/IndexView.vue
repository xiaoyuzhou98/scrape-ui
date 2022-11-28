<template>
  <section class="page">
    <ul class="videoList" v-if="videos.length">
      <li v-for="(video, index) in videos" :key="index">
        <el-card shadow="hover">
          <div class="icon"></div>
          <div class="detail">
            <div>User: @{{ video.user }}</div>
            <div>
              <a :href="video.url" target="_blank">{{ video.url }}</a>
            </div>
            <el-button @click="openDialog(video)">预览</el-button>
            <el-button @click="open()">打开本地文件夹</el-button>
          </div>
        </el-card>
      </li>
    </ul>
    <el-dialog :title="link" :visible.sync="dialogVisible" width="40%">
      <video
        autoplay
        controls
        muted
        width="100%"
        x5-video-player-type="h5"
        playsinline="true"
        webkit-playsinline="true"
        x-webkit-airplay="true"
        x5-video-orientation="portraint"
        x5-video-player-fullscreen="true"
        :src="src"
      ></video>
    </el-dialog>
  </section>
</template>

<script>
const { shell } = window.require("electron");
export default {
  name: "Videos",
  data() {
    return {
      videos: [],
      src: "",
      link: "",
      dialogVisible: false,
      path: "",
    };
  },
  async created() {
    await this.$api
      .getLocalVideos()
      .then((res) => {
        const { videos, path } = res;
        this.path = path;
        videos.forEach((video) => {
          const data = {
            user: video.split("_")[0],
            url: `https://twitter.com/${video.split("_")[0]}/status/${video.split("_")[1].split(".")[0]}`,
            name: video,
            src: `${path}\\${video}`,
          };
          this.videos.push(data);
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
    openDialog(video) {
      this.dialogVisible = true;
      this.src = video.src;
      this.link = video.url;
    },
    open() {
      shell.openPath(this.path);
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: 10rem;
  max-height: 9rem;
  margin: 0 auto;
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
}
</style>
