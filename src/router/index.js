import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Login from '../components/Login.vue'

//ROUTE LAYOUTS
import Navbar from '../components/layouts/Navbar.vue'

//ROUTE ADMIN
import Home from '../components/admin/Home.vue'
import Kereta from '../components/admin/Kereta.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    components: { default: Login}
  },
  {
    path: '/',
    name: 'home',
    components: { default: Home, header: Navbar},
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/kereta',
    name: 'kereta',
    components: { default: Kereta, header: Navbar,},
    meta: {
      requiresAuth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
