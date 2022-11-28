import Vue from "vue";
import Vuex from "vuex";
import api from "../api/api";
import createPersistedState from "vuex-persistedstate";
import { Message } from "element-ui";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    config: {
      proxy: "",
      savePath: "",
    },
    isLaunch: false,
  },
  getters: {
    getConfig(state) {
      return state.config;
    },
    isLaunch(state) {
      return state.isLaunch;
    },
  },
  mutations: {
    setConfig(state, config) {
      state.config = config;
    },
    setLaunch(state, value) {
      state.isLaunch = value;
    },
  },
  actions: {
    async updateConfig(context, config) {
      let res: any;
      if (config) {
        res = await api.updateConfig(config.proxy, config.savePath).catch((e) => {
          Message({
            message: e,
            type: "error",
            duration: 4000,
          });
        });
        Message({
          message: "Configuration saved!",
          type: "success",
          duration: 4000,
        });
      } else {
        res = await api.updateConfig("", "").catch((e) => {
          Message({
            message: "Access config failed,please restart the programme",
            type: "error",
            duration: 4000,
          });
        });
      }
      const data = {
        proxy: res.args[0].split("=")[1],
        savePath: res.savePath,
      };
      context.commit("setConfig", data);
    },
  },

  plugins: [
    createPersistedState({
      storage: window.localStorage,
      // reducer(val) {
      //   return {
      //     info: val,
      //   };
      // },
    }),
  ],
});
