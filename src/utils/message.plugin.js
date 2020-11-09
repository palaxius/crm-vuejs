import localizeFilter from "@/filters/localize.filter";

export default {
  install(Vue) {
    Vue.prototype.$message = function(html) {
      // eslint-disable-next-line no-undef
      M.toast({ html });
    };

    Vue.prototype.$error = function(html) {
      // eslint-disable-next-line no-undef
      M.toast({ html: `[${localizeFilter("Error")}]: ${html}` });
    };
  }
};
