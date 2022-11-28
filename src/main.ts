import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import "./styles/global.scss";
import {
  Button,
  Dialog,
  Card,
  Form,
  FormItem,
  Input,
  Tag,
  Select,
  Switch,
  Option,
  RadioGroup,
  RadioButton,
  Menu,
  MenuItem,
  Loading,
  Message,
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Tag);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Option);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Loading);
Vue.prototype.$message = Message;


import api from "./api/api";
Vue.prototype.$api = api;

import utils from "./utils/index";
Vue.prototype.$utils = utils;

import filters from "./utils/filters";
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
