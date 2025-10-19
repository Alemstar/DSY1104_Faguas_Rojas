import { Outlet, useNavigation } from "react-router-dom"
import NavBarRoot from "../components/root/NavBarRoot"
import Footer from "../components/footer/Footer"

export default function Root() {
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  return (
    <>
      <NavBarRoot />
      <main>
        {isLoading ? (
          <div >
            <p>Cargando...</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </>
  )
}