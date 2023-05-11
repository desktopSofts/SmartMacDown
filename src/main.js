import { createApp } from 'vue'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faUserSecret, faMagnifyingGlass,
    faXmark, faFile, faPenToSquare, faTrashAlt
    , faFileImport, faPlus
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faMagnifyingGlass
    , faXmark, faFile, faPenToSquare, faTrashAlt
    , faFileImport, faPlus
    )

// vue3 使用图标组件例子如下：
// <!-- <font-awesome-icon icon="fa-solid fa-user-secret" /> -->

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
