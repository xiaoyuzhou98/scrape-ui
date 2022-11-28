export default {
  getTimeOffset() {
    const time = new Date().toString();
    const arr = time.split(" ");
    const offset = arr[arr.length - 2].replace("GMT", "");
    const str = offset.slice(0, 3) + ":" + offset.slice(3);
    return str;
  },
  formatDate(strDate: any, strFormat?: any) {
    if (!strDate) return;
    if (!strFormat) strFormat = "yyyy/MM/dd HH:mm";
    switch (typeof strDate) {
      case "string":
        strDate = new Date(strDate.replace(/-/g, "/"));
        break;
      case "number":
        strDate = new Date(strDate);
        break;
    }
    if (strDate instanceof Date) {
      const dict: any = {
        yyyy: strDate.getFullYear(),
        M: strDate.getMonth() + 1,
        d: strDate.getDate(),
        H: strDate.getHours(),
        m: strDate.getMinutes(),
        s: strDate.getSeconds(),
        MM: ("" + (strDate.getMonth() + 101)).substr(1),
        dd: ("" + (strDate.getDate() + 100)).substr(1),
        HH: ("" + (strDate.getHours() + 100)).substr(1),
        mm: ("" + (strDate.getMinutes() + 100)).substr(1),
        ss: ("" + (strDate.getSeconds() + 100)).substr(1),
      };
      return strFormat.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function (m: any) {
        return dict[m];
      });
    }
  },
  handleCopy(value: string) {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = value;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  },
  setCookie(key: string, value: string, time: number) {
    const num = new Date(new Date().getTime() + time * 60 * 1000 * 60);
    document.cookie = `${key} = ${value};expires = ` + num.toUTCString() + ";path = /";
  },
  getCookie(name: string) {
    let arr: any = [];
    const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  },
  delCookie(name: string) {
    this.setCookie(name, "", -1);
  },
  findObj(obj: any, arr: Array<any>) {
    for (const arrObj of arr) {
      if (arrObj.user === obj.user && arrObj.url === obj.url) return true;
    }
    return false;
  },
};
