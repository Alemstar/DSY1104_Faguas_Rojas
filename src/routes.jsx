import { createBrowserRouter } from 'react-router-dom'
import Root from './pages/Root'
import Home from './pages/home/Home'
import Products from './pages/products/index'
import { productsLoader } from './loaders/products'
import { homeLoader } from './loaders/home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/profile/Profile'



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
          }
        ]
      }
      ,
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'registro',
        Component: Register
      }
      ,
      {
        path: 'perfil',
        Component: Profile
      }

    ]
  }
])
