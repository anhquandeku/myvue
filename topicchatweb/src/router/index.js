import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/components/LoginPage.vue'
import HomePage from '@/components/HomePage.vue'
import ChatPage from '@/components/ChatPage.vue'

const routes = [
    {
        path: '/',
        name: "Home",
        component: HomePage
    },
    {
        path: '/login',
        name: "Login",
        component: LoginPage
    },
    {
        path: '/chat',
        name: "Chat",
        component: ChatPage
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})

export default router
