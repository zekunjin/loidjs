import Vue from 'vue'
import VueRouter from 'vue-router'
import type { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: RouteConfig[] = []

export const router = new VueRouter({
  mode: 'history',
  routes
})
