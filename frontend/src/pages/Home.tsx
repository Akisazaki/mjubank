import { Typography } from "@mui/material";
import { useContext } from "react";
import { Dashboard } from "../components/Dashboard";
import { AuthContext } from "../utils/authProvider";





export function Home() {
  const auth = useContext(AuthContext)
  const user = auth.user!

  return (
    <Dashboard title="Home">
      <Typography variant='h5'>반갑습니다, {user.name}!</Typography>
      <Typography>MJU Bank입니다.</Typography>
    </Dashboard>
  )
}