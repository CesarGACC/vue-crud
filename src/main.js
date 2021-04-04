import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from "primevue/config";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Row from 'primevue/row';
import Dialog from 'primevue/dialog';
import VueApexCharts from "vue3-apexcharts";

import "primeflex/primeflex.css";
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
import "primeicons/primeicons.css";
createApp(App)
    .use(router)
    .use(PrimeVue)
    .use("VueApexCharts",VueApexCharts)
    .component("Button",Button)
    .component("Column", Column)
    .component("Dialog",Dialog)
    .component("DataTable", DataTable)
    .component("InputText",InputText)
    .component("InputNumber",InputNumber)
    .component("Row",Row)
    .mount('#app')
