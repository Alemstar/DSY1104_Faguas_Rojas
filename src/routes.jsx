import { createBrowserRouter } from 'react-router-dom'
import Root from './pages/root.jsx'
import Home from './pages/Home.jsx'

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