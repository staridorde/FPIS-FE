import { createRouter, createWebHistory } from 'vue-router'
import UnosKlijenta from '../components/klijent/UnosKlijenta.vue'
import UnosZahteva from '../components/zahtev/UnosZahteva.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
