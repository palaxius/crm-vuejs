import Vue from "vue";
import Vuelidate from "vuelidate/src";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from "@/filters/date.filter";
import messagePlugin from "@/utils/message.plugin";
import Loader from "@/components/app/Loader";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";
import firebase from "firebase";

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.filter("date", dateFilter);
Vue.component("Loader", Loader);

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
