import Vue from "vue";
import Vuelidate from "vuelidate/src";
import dateFilter from "@/filters/date.filter";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";
import App from "./App.vue";
import store from "./store";
import tooltipDirective from "@/directives/tooltip.directive.";
import messagePlugin from "@/utils/message.plugin";
import titlePlugin from "@/utils/title.plugin";
import VueMeta from "vue-meta";
import Loader from "@/components/app/Loader";
import router from "./router";
import firebase from "firebase";
import Paginate from "vuejs-paginate";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.use(titlePlugin);
Vue.use(VueMeta);
Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);
Vue.filter("localize", localizeFilter);
Vue.directive("tooltip", tooltipDirective);
Vue.component("Loader", Loader);
Vue.component("Paginate", Paginate);

firebase.initializeApp({
  apiKey: "AIzaSyBwCvjOAkOyPnwm-du3IL8d44BKfNcOXbA",
  authDomain: "crm-vue-326c0.firebaseapp.com",
  databaseURL: "https://crm-vue-326c0.firebaseio.com",
  projectId: "crm-vue-326c0",
  storageBucket: "crm-vue-326c0.appspot.com",
  messagingSenderId: "566319206922",
  appId: "1:566319206922:web:758c4865864e78e4a385f3"
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
