import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/WelcomePage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresAuth: false }
  },

  // User Routes
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/user-dashboard',
    name: 'UserDashboard',
    component: () => import('../views/UserDashboard.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/product/add',
    name: 'AddProduct',
    component: () => import('../views/User/AddProduct.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue'),
    meta: { requiresAuth: true }
  },

  // Admin Routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/Admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    redirect: '/admin/pending-products',
    children: [
      {
        path: 'pending-products',
        name: 'PendingProducts',
        component: () => import('../views/Admin/PendingProducts.vue')
      },
      {
        path: 'product/:id/process',
        name: 'ProcessProduct',
        component: () => import('../views/Admin/ProcessProduct.vue')
      },
      {
        path: 'comments',
        name: 'AdminComments',
        component: () => import('../views/Admin/CommentManagement.vue')
      }
    ]
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()
  
//   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//     next('/login')
//   } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Redirect berdasarkan role
//     if (authStore.user?.role === 'admin') {
//       next('/admin')
//     } else {
//       next('/user-dashboard')
//     }
//   } else {
//     next()
//   }
// })



router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Belum login → lempar ke /login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  // Role tidak sesuai → redirect sesuai role
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    if (authStore.user?.role === 'admin' && to.path !== '/admin') {
      return next('/admin');
    } else if (authStore.user?.role === 'user' && to.path !== '/user-dashboard') {
      return next('/user-dashboard');
    }
  }

  next();
});



export default router