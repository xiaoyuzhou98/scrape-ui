import axios from "axios";
import qs from "qs";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
});
service.defaults.withCredentials = true;
// service.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
service.interceptors.response.use(
  (response) => {
    if (response.status == 200) {
      return response.data;
    } else {
      return response;
    }
  },
  (error) => {
    return Promise.reject(error.response.data.error);
  },
);
export default {
  get(url: string) {
    return new Promise((resolve, reject) => {
      service
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  post(url: string, data: any) {
    return new Promise((resolve, reject) => {
      service
        .post(url, qs.stringify(data))
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getAndHeaders(url: string, headers: any) {
    return new Promise((resolve, reject) => {
      service
        .get(url, headers)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  postAndHeaders(url: string, data: any, headers: any) {
    return new Promise((resolve, reject) => {
      service
        .post(url, data, headers)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
