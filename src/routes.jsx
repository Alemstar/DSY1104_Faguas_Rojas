import { createBrowserRouter } from 'react-router-dom'
import Root from './pages/Root'
import Home from './pages/home/Home'
import Products from './pages/products/index'
import ProductDetail from './pages/productDetail/ProductDetail'
import Cart from './pages/cart/Cart'
import CustomCake from './pages/customCake/CustomCake'
import Blog from './pages/blog/Blog'
import { productsLoader } from './loaders/products'
import { homeLoader } from './loaders/home'
import { productDetailLoader } from './loaders/productDetail'
import { cartLoader } from './loaders/cart'
import { customCakeLoader } from './loaders/customCake'
import { blogLoader } from './loaders/blog'



export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      },
      {
        path: "productos",
        children: [
          {
            index: true,
            Component: Products,
            loader: productsLoader,
          },
          {
            path: ":code",
            Component: ProductDetail,
            loader: productDetailLoader,
          }
        ]
      },
      {
        path: "carrito",
        Component: Cart,
        loader: cartLoader,
      },
      {
        path: "personaliza-tu-torta",
        Component: CustomCake,
        loader: customCakeLoader,
      },
      {
        path: "recetas-blogs",
        Component: Blog,
        loader: blogLoader,
      }

    ]
  }
])
