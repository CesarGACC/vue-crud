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

import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
import "primeicons/primeicons.css";
createApp(App)
    .use(router)
    .use(PrimeVue)
    .component("DataTable", DataTable)
    .component("Column", Column)
    .component("Button",Button)
    .component("InputText",InputText)
    .component("InputNumber",InputNumber)
    .component("Dialog",Dialog)
    .component("Row",Row)
    .mount('#app')
