import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import InputText from "primevue/inputtext";
import Chart from "primevue/chart";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Menu from "primevue/menu";

import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
// import "./assets/styles.scss";

createApp(App)
  .use(router)
  .use(store)
  .use(PrimeVue, { ripple: true })
  .use(ConfirmationService)
  .use(ToastService)
  .component("Menu", Menu)
  .component("Dialog", Dialog)
  .component("InputText", InputText)
  .component("Button", Button)
  .component("Avatar", Avatar)
  .component("ConfirmDialog", ConfirmDialog)
  .component("Toast", Toast)
  .component("Chart", Chart)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .mount("#app");
