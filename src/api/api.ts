import service from "./service";
const prefix = process.env.NODE_ENV === "production" ? "http://localhost:8083" : "api";

export default {
  // 获取登录的Url
  // getLoginUrl(fromId: number) {
  //   return service.get(`/login/url${fromId ? "?fromId=" + fromId : ""}`);
  // },

  getTweets(user: string) {
    // return service.get(`api/tweets?user=${user}`);
    return service.get(`${prefix}/tweets?user=${user}`);
  },

  getTweetsScreenshot(url: string) {
    // return service.post("api/tweets/screenshot", { url });
    return service.post(`${prefix}/tweets/screenshot`, { url });
  },

  getTweetsVideo(url: string, loop: string, bgm: string) {
    // const data = {
    //   url,
    //   loop,
    //   src,
    // };
    // return service.post("api/tweets/video", data);    
    return service.post(`${prefix}/tweets/video`, { url, loop, bgm });
  },

  getLocalImages() {
    return service.get(`${prefix}/local/images`);
  },

  getLocalVideos() {
    return service.get(`${prefix}/local/videos`);
  },

  updateConfig(proxy: string, savePath: string) {
    // const data = {
    //   proxy,
    //   savePath,
    // };
    // return service.post("api/tweets/video", data);
    return service.post(`${prefix}/config`, { proxy, savePath });
  },
};
