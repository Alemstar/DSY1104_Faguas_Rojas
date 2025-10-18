import { createBrowserRouter } from 'react-router-dom'
import Root from './pages/Root'
import Home from './pages/home/Home'
import Products from './pages/products/index'
import ProductDetail from './pages/productDetail/ProductDetail'
import { productsLoader } from './loaders/products'
import { homeLoader } from './loaders/home'
import { productDetailLoader } from './loaders/productDetail'



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
      }

    ]
  }
])
