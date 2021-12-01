import { useContext } from "react";
import { Dashboard } from "../components/Dashboard";
import { AuthContext } from "../utils/authProvider";





export function Home() {
  const auth = useContext(AuthContext)
  const user = auth.user!

  return (
    <Dashboard title="Home">
      Hello {user.name}!
    </Dashboard>
  )
}