import { SearchProduct } from "../pages/SearchProduct/SearchProduct";
import { AdminPage } from "../pages/AdminPage/AdminPage";
import { HomePage } from "../pages/HomePage/HomePage";
import { LogInPage } from "../pages/LogInPage/LogInPage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
import { OrderPage } from "../pages/OrderPage/OrderPage";
import { ProductDetailPage } from "../pages/ProductDetailPage/ProductDetailPage";
import { ProductPage } from "../pages/ProductPage/ProductPage";
import { ProfileUserPage } from "../pages/ProfileUserPage/ProfileUserPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";
import { TypeProductPage } from "../pages/TypeProductPage/TypeProductPage";
import { PaymentPage } from '../pages/PaymentPage/PaymentPage'
import { OrderSuccessPage } from "../pages/OrderSuccessPage/OrderSuccessPage";
import { MyOrderPage } from "../pages/MyOrderPage/MyOrderPage";
import { MyOrderDetailsPage } from "../pages/MyOrderDetailsPage/MyOrderDetailsPage";
import { SalesProduct } from "../pages/SalesProduct/SalesProduct";
export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/my-order-detail/:id',
        page: MyOrderDetailsPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/order-success',
        page: OrderSuccessPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/product',
        page: ProductPage,
        isShowHeader: true,
        isShowFooter: true,

    },
    {
        path: '/product-sales',
        page: SalesProduct,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/search-product',
        page: SearchProduct,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/login',
        page: LogInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/product-detail/:id',
        page: ProductDetailPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/profile-user',
        page: ProfileUserPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },
]