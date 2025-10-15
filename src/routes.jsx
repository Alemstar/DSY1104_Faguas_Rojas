import { createBrowserRouter } from 'react-router-dom'
import Root from './pages/Root'
import Home from './pages/home/Home'
import { homeLoader } from './loaders/home'


export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        loader: homeLoader,
      }
    ]
  }
])
