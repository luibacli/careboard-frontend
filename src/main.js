import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column'
import Tag from 'primevue/tag';
import Chart from 'primevue/chart';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import Dialog from 'primevue/dialog';
import TabPanel from 'primevue/tabpanel';

import { Card, Button, Select, InputText, DatePicker,} from 'primevue'
import { createPinia } from 'pinia'


const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue'
            }
        }
    }
});
app.use(ToastService);
app.use(createPinia())
app.use(router)
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Tag', Tag);
app.component('Chart', Chart);
app.component('Card', Card);
app.component('Button', Button);
app.component('Select', Select);
app.component('InputText', InputText);
app.component('DatePicker', DatePicker);
app.component('Tabs', Tabs),
app.component('Tab', Tab),
app.component('TabList', TabList),
app.component('TabPanels', TabPanels),
    app.component('TabPanel', TabPanel)
app.component('Dialog', Dialog),
    


app.mount('#app')
