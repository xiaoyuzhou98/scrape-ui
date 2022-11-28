import Vue from "vue";
import VueI18n from "vue-i18n";
import utils from "../utils/index";
import ZH from "./zh";
import EN from "./en";
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: utils.getCookie("LANG") || "ZH",
  messages: {
    ZH: Object.assign(ZH),
    EN: Object.assign(EN),
  },
});
export default i18n;
