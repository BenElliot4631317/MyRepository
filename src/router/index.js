import { createRouter, createWebHistory } from "vue-router";
import NavbarSection from "@/components/NavbarSection.vue";
import SecondLoginPage from "@/components/Pages/LoginPage.vue";
import SignUpPage from "@/components/Pages/SignUpPage.vue";
import MyHomePage from "@/components/Pages/MyHomePage.vue";
import AuthorPage from "@/components/Pages/AuthorPage.vue";
import EditProfilePage from "@/components/Pages/EditProfilePage.vue";
import PostBlogPage from "@/components/Pages/PostBlogPage.vue";
import blogComponent from "@/components/blogComponent.vue";
import {localStorageService} from "@/LocalStorageService";
import TestComponent from "@/components/TestComponent.vue";
import BlogPage from "@/components/Pages/BlogPage.vue";
import LatestPostSection from "@/components/BlogSection/LatestPostSection.vue";
import BrowsePostPage from "@/components/Pages/BrowsePostPage.vue";
import BlogManagementPage from "@/components/Pages/BlogManagementPage.vue";
import EditBlogPage from "@/components/Pages/EditBlogPage.vue";
import CommentManagementPage from "@/components/Pages/CommentManagementPage.vue";


const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: MyHomePage,
        meta: {title: 'HomePage'}
    },
    {
        path:'/navbar',
        name: 'Navbar',
        component: NavbarSection
    },
    {
        path:'/login',
        name: 'SecondLoginPage',
        component: SecondLoginPage,
        meta: {title: 'Log In'}
    },
    {
        path:'/signup',
        name: 'SignUpPage',
        component: SignUpPage,
        meta: {title: 'Sign Up'}
    },
    {
        path: '/author/:id',
        name: 'AuthorPage',
        component: AuthorPage,
        props: route => ({ user_id : parseInt(route.query.user_id) }),
        meta: {title: 'Author'}
    },
    {
        path: '/author/edit',
        name: 'EditProfilePage',
        component: EditProfilePage,
        meta: {title: 'Edit Profile'}
    },
    {
        path: '/author/post',
        name: 'PostBlogPage',
        component: PostBlogPage,
        title: {title: 'Post Blog'}
    },
    {
        path: '/blog_test',
        name: 'BlogTest',
        component: blogComponent
    },
    {
        path: '/test',
        name: 'Test',
        component: TestComponent
    },
    {
        path: '/blog/:post_id',
        name: 'Blog',
        component: BlogPage,
        props: true
    },
    {
        path: '/latest_blog',
        name: 'LatestBlogPage',
        component: LatestPostSection
    },
    {
        path: '/browse/',
        name: 'Browse',
        component: BrowsePostPage,
        props: route => ({ page: parseInt(route.query.page) || 1 })
    },
    {
        path: '/management',
        name: 'Management',
        component: BlogManagementPage
    },
    {
        path: '/blog/edit/:blog_id',
        name: 'EditBlog',
        component: EditBlogPage,
        props: route => ({ blog_id: parseInt(route.query.blog_id)})
    },
    {
        path: '/blog/comment-management/:blog_id',
        name: 'BlogManagement',
        component: CommentManagementPage,
        props: route => ({ blog_id: parseInt(route.query.blog_id)})
    },

    
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            // 如果有保存的位置（比如浏览器后退/前进），返回之前的滚动位置
            return savedPosition;
        } else {
            // 否则滚动到页面顶部
            return { top: 0 };
        }
    },
});

const protectedRoutes = ['/author/edit', '/author/post', '/management'];

router.beforeEach((to, from, next) => {
    const token = localStorageService.getItem('auth_token');
    document.title = to.meta.title || to.name;
    
    if (protectedRoutes.includes(to.path) && !token) {
        next({path: '/login'});
    }else {
        next();
    }
})

export default router;