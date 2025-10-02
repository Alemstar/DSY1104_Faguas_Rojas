import { createBrowserRouter } from 'react-router'
import Root from './pages/root'
import Home from './pages/Home'
    //import Home from './pages/home/index'
    //import Products from './pages/products/index'
    //import { productsLoader } from './loaders/products'
    //import { homeLoader } from './loaders/home'

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home
      }
    ]
  }
])