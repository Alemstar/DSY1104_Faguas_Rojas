import { createBrowserRouter } from 'react-router-dom'
import Root from './pages/Root.jsx'
import Home from './pages/home/Home.jsx'
import { homeLoader } from './loaders/home.js'

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