export default {
  /**钱包地址超出 */
  ellipsisWallet(value: string) {
    if (!value) return "";
    const index = value.length;
    return value.slice(0, 6) + "..." + value.slice(index - 4, index);
  },
  /**邮箱超出 */
  ellipsisMail(value: string) {
    if (!value) return "";
    const index = value.length;
    const index2 = value.indexOf("@");
    return value.slice(0, 2) + "***" + value.slice(index2, index);
  },
  /**整数千分位 */
  thousandsInteger(value: number) {
    if (!value) return 0;
    const str = Number(value.toString()).toLocaleString("en-US");
    return str;
  },
  /**小数千分位 */
  thousandsDecimals(value: number, bit = 2) {
    if (!value) return 0;
    const str = Number(value.toFixed(bit)).toLocaleString("en-US");
    return str;
  },
  /**去掉小数后的0 */
  numberCutZero(value: number) {
    const str = value.toString();
    const newstr = str;
    const leng = str.length - str.indexOf(".") - 1;
    if (str.indexOf(".") > -1) {
      for (let i = leng; i > 0; i--) {
        if (newstr.lastIndexOf("0") > -1 && Number(newstr.substr(newstr.length - 1, 1)) == 0) {
          const k = newstr.lastIndexOf("0");
          if (newstr.charAt(k - 1) == ".") return newstr.substring(0, k - 1);
          return newstr.substring(0, k);
        }
        return newstr;
      }
    }
    return value;
  },
};
