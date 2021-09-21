import { createRouter, createWebHistory } from 'vue-router'
import UnosKlijenta from '../components/klijent/UnosKlijenta.vue'
import PretragaKlijenta from '../components/klijent/PretragaKlijenta.vue'
import UnosZahteva from '../components/zahtev/UnosZahteva.vue'
import IzmenaZahteva from '../components/zahtev/IzmenaZahteva.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/unosKlijenta'
  },
  {
    path: '/unosKlijenta',
    name: 'UnosKlijenta',
    component: UnosKlijenta
  },
  {
    path: '/unosZahteva',
    name: 'UnosZahteva',
    component: UnosZahteva
  },
  {
    path: '/pretragaKlijenta',
    name: 'PretragaKlijenta',
    component: PretragaKlijenta
  },
  {
    path: '/izmenaZahteva',
    name: 'IzmenaZahteva',
    component: IzmenaZahteva
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
