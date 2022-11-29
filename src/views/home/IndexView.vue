<template>
  <section class="page">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item class="user" label="用户名">
        <el-input v-model="form.user" placeholder="添加需爬虫用户名(最多5名)" @keyup.native.enter="addTag" :disabled="isLaunch"></el-input>
        <el-button class="add" :disabled="!form.user" @click="addTag">添加</el-button>
      </el-form-item>
      <el-form-item v-show="form.tags.length" label="已添加">
        <el-tag v-for="(tag, index) in form.tags" :key="index" :closable="!isLaunch" @close="close(tag)">
          <a :href="tag.link" target="_blank">{{ tag.name }}</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="间隔时间">
        <el-select v-model="form.interval" placeholder="请选择" :disabled="isLaunch">
          <el-option v-for="item in form.options1" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人工审核">
        <el-switch v-model="form.handle" :disabled="isLaunch"></el-switch>
      </el-form-item>
      <el-form-item label="视频时长">
        <el-select v-model="form.duration" placeholder="请选择（可选）" :disabled="isLaunch || form.handle">
          <el-option v-for="item in form.options2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="背景音乐">
        <input type="file" id="file" hidden @change="fileChange" accept=".mp3" />
        <el-input placeholder="添加背景音乐" v-model="form.bgm" class="input-with-select" :disabled="isLaunch || form.handle">
          <el-button slot="append" icon="el-icon-microphone" type="success" @click="btnChange"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-loading="isLaunch" class="launch" type="primary" @click="launch" :disabled="form.tags.length === 0">启动</el-button>
        <span class="already" v-show="isLaunch">已开启{{ second }}秒</span>

        <el-button v-show="isLaunch" @click="cancel">暂停</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      form: {
        interval: 15,
        duration: "",
        user: "elonmusk",
        tags: [],
        amount: 1,
        handle: false,
        bgm: "",
        options1: [
          {
            value: 15,
            label: "15s",
          },
          {
            value: 30,
            label: "30s",
          },
          {
            value: 300,
            label: "300s",
          },
          {
            value: 1800,
            label: "1800s",
          },
        ],
        options2: [
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
      status: false,
      // isLaunch: false,
      second: 0,
      oldList: JSON.parse(localStorage.getItem("urlList")) || [],
      updatingList: JSON.parse(localStorage.getItem("updatingList")) || [],
      launcher: null,
      timer: null,
    };
  },
  computed: {
    ...mapGetters(["isLaunch"]),
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.launcher);
    this.timer = null;
    this.launcher = null;
  },
  methods: {
    ...mapMutations(["setLaunch"]),
    // findObj(obj, arr) {
    //   for (let arrObj of arr) {
    //     if (arrObj.user === obj.user && arrObj.url === obj.url) return true;
    //   }
    //   return false;
    // },

    isUpdated(newList) {
      let status = false;
      let updated = false;
      if (!newList.length) return status;
      if (!this.oldList.length) {
        console.log("replace");
        status = true;
        for (let item of newList) {
          console.log(`New url got from ${item.user}:\n${item.url}`);
          this.$message({
            message: `New url got from ${item.user}:\n${item.url}`,
            type: "success",
            duration: 4000,
          });
          this.getNewTweetsScreenshotsAndVideo(item);
        }
        this.oldList = newList;
        localStorage.setItem("urlList", JSON.stringify(this.oldList));
      } else {
        newList.forEach((newItem) => {
          if (!this.$utils.findObj(newItem, this.oldList)) {
            //查看是新的查询对象还是原有对象的url属性已更新
            for (let oldItem of this.oldList) {
              if (oldItem.user === newItem.user) {
                oldItem.url = newItem.url;
                updated = true;
                break;
              }
            }
            if (!updated) {
              console.log("push");
              this.oldList.push(newItem);
            }
            status = true;
            console.log(`New url got from ${newItem.user}:\n${newItem.url}`);
            this.$message({
              message: `New url got from ${newItem.user}:\n${newItem.url}`,
              type: "success",
              duration: 4000,
            });
            this.getNewTweetsScreenshotsAndVideo(newItem);

            localStorage.setItem("urlList", JSON.stringify(this.oldList));
          }
        });
      }
      return status;
    },

    async getNewTweetsScreenshotsAndVideo(item) {
      item = JSON.parse(JSON.stringify(item));
      await this.$api
        .getTweetsScreenshot(item.url)
        .then((image) => {
          console.log("New tweet scrrenshot saved: ", image);
          this.$message({
            message: `New tweet scrrenshot saved: ${image}`,
            type: "success",
            duration: 4000,
          });
        })
        .catch((e) => {
          this.$message({
            message: e,
            type: "error",
            duration: 4000,
          });
          return;
        });

      if (!this.form.handle) {
        const video = await this.$api.getTweetsVideo(item.url, this.form.duration,this.form.bgm);
        console.log("New tweet video saved: ", video);
        this.$message({
          message: `New tweet video saved: ${video}`,
          type: "success",
          duration: 4000,
        });
      } else {
        this.updatingList.push(item);
        localStorage.setItem("updatingList", JSON.stringify(this.updatingList));
      }
    },

    //获取标签列表检查是否有新的推文
    async getNewTweets() {
      const newList = [];
      for (let tag of this.form.tags) {
        await this.$api
          .getTweets(tag.name)
          .then((res) => {
            const data = {
              user: tag.name,
              url: res,
            };
            newList.push(data);
          })
          .catch((e) => {
            this.$message({
              message: e,
              type: "error",
              duration: 4000,
            });
          });
      }
      console.log("Update operation:", this.isUpdated(newList));
    },

    launch() {
      this.setLaunch(true);
      // this.isLaunch = true;
      this.$message({
        message: "Programme starts!",
        type: "success",
        duration: 4000,
      });
      console.log(`Handle mode: ${this.form.handle}`);

      this.getNewTweets();
      this.launcher = setInterval(async () => {
        this.getNewTweets();
      }, this.form.interval * 1000);

      this.timer = setInterval(() => {
        this.second++;
      }, 1000);
    },

    addTag() {
      if (this.form.user && this.form.tags.length < 5) {
        const link = `https://twitter.com/${this.form.user}`;
        const tag = {
          name: this.form.user,
          link: link,
        };
        this.form.tags.push(tag);
        this.form.user = "";
      } else if (this.form.tags.length >= 5) {
        this.$message({
          message: "已达最大上限",
          type: "error",
          duration: 4000,
        });
      } else {
        this.$message({
          message: "输入不能为空",
          type: "error",
          duration: 4000,
        });
      }
    },
    close(tag) {
      this.form.tags = this.form.tags.filter((t) => {
        return t !== tag;
      });
    },
    cancel() {
      clearInterval(this.timer);
      clearInterval(this.launcher);
      this.timer = null;
      this.launcher = null;
      this.setLaunch(false);
      // this.isLaunch = false;
      this.second = 0;
      this.$message({
        message: "Programme ends!",
        type: "success",
        duration: 4000,
      });
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
  width: 50%;
  // float: right;
  margin: 2.5rem auto;
  .user {
    position: relative;
    .add {
      position: absolute;
      right: 0;
    }
  }

  .el-tag {
    font-size: 0.14rem;
    margin-right: 0.2rem;
  }
  .already {
    font-size: 0.14rem;
    color: #000;
    margin: 0 0.2rem;
  }
}
</style>
