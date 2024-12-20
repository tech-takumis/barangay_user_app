import { createWebHistory, createRouter } from 'vue-router'
import { useUsers } from '@/stores/user'
import Welcome from '@/pages/Welcome.vue'
import Dashboard from '../pages/Dashboard.vue'


const APP_NAME = import.meta.env.VITE_APP_NAME

const routes = [
    {
        path: '/',
        name: 'welcome',
        component: Welcome,
        meta: {
            title: 'Welcome',
            metaTags: [
                {
                    name: 'Welcome',
                    content:
                        'An application for requesting barangay certificate.',
                },
                {
                    property: 'og:Welcome',
                    content:
                        'An application for requesting barangay certificate.',
                },
            ],
        },
    },
    {
        path: '/home',
        redirect: '/dashboard',
        component: () => import("@/pages/Dashboard.vue"),
        query: {
            verified: 'verified',
        },
        meta: {
            guard: 'auth',
        },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import("@/pages/Dashboard.vue"),
        meta: {
            title: 'Dashboard',
            guard: 'auth',
        },
    },
    {
        path: '/certificate/:id',
        name: 'certificate',
        component: () => import('@/components/CertificateRequestForm.vue'),
        meta: {
            title: 'Certificate',
            guard: 'auth',
        },
    },
    {
        path: '/certificate/requested',
        name: 'certificate_requested',
        component: () => import('@/components/CertificateRequestTable.vue'),
        meta: {
            title: 'Certificate Requested',
            guard: 'auth',
        },
    },
    {
        path: '/certificate-request/:id',
        name: 'CertificateRequestCredential',
        component: () => import('@/components/CertificateRequestCredential.vue'),
        meta: {
            title: 'Certificate Request',
            guard: 'auth',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: ()=>import('@/pages/auth/Login.vue'),
        query: {
            reset: 'reset',
        },
        meta: {
            title: 'Log in',
            guard: 'guest',
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/auth/Register.vue'),
        meta: {
            title: 'Register',
            guard: 'guest',
        },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPassword.vue'),
        meta: {
            title: 'Forget Password',
            guard: 'guest',
        },
    },
    {
        path: '/password-reset/:token',
        name: 'password-reset',
        component: () => import('@/pages/auth/ResetPassword.vue'),
        query: {
            email: 'email',
        },
        meta: {
            title: 'Reset Password',
            guard: 'guest',
        },
    },
    {
        path: '/verify-email',
        name: 'verify-email',
        component: () => import('@/pages/auth/VerifyEmail.vue'),
        query: {
            resend: 'resend',
        },
        meta: {
            title: 'Email Verification',
            guard: 'auth',
        },
    },
    {
        path: '/page-not-found',
        name: 'page-not-found',
        component: () => import('@/pages/errors/404.vue'),
        meta: {
            title: 'Page Not Found',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/page-not-found',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard

router.beforeEach((to, from, next) => {
    const store = useUsers()

    const auth = store.authUser

    if (to.matched.some(route => route.meta.guard === 'guest') && auth)
        next({ name: 'dashboard' })
    else if (to.matched.some(route => route.meta.guard === 'auth') && !auth)
        next({ name: 'login' })
    else next()
})

// Page Title and Metadata

router.beforeEach((to, from, next) => {
    const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.title)

    const nearestWithMeta = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.metaTags)

    if (nearestWithTitle) {
        document.title = nearestWithTitle.meta.title + ' - ' + APP_NAME
    } else {
        document.title = APP_NAME
    }

    Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
        el => el.parentNode.removeChild(el),
    )

    if (!nearestWithMeta) return next()

    nearestWithMeta.meta.metaTags
        .map(tagDef => {
            const tag = document.createElement('meta')

            Object.keys(tagDef).forEach(key => {
                tag.setAttribute(key, tagDef[key])
            })

            tag.setAttribute('data-vue-router-controlled', '')

            return tag
        })

        .forEach(tag => document.head.appendChild(tag))

    next()
})

export default router
