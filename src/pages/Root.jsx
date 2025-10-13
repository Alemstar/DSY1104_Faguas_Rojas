import { Outlet, useNavigation } from "react-router"
import NavBarRoot from "../components/root/NavBarRoot"



export default function root() {
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
    </>

  )
}