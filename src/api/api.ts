import service from "./service";
const prefix = process.env.NODE_ENV === "production" ? "http://localhost:8083" : "api";

export default {
  getTweets(user: string) {
    return service.get(`${prefix}/tweets?user=${user}`);
  },

  getTweetsScreenshot(url: string) {
    return service.post(`${prefix}/tweets/screenshot`, { url });
  },

  getTweetsVideo(url: string, loop: string, bgm: string) {  
    return service.post(`${prefix}/tweets/video`, { url, loop, bgm });
  },

  getLocalImages() {
    return service.get(`${prefix}/local/images`);
  },

  getLocalVideos() {
    return service.get(`${prefix}/local/videos`);
  },

  updateConfig(proxy: string, savePath: string) {
    return service.post(`${prefix}/config`, { proxy, savePath });
  },
};
