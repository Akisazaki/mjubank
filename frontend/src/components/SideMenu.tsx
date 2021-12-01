import { AccountBalance, AccountCircle, CreditCard, Logout } from "@mui/icons-material";
import { Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";


export const SideMenu = () => {
  const auth = useContext(AuthContext)

  return (
    <div className="side-menu">
      <Toolbar />
      <Divider />
      <List>
        <Link to="/profile">
          <ListItem>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="사용자 정보" />
          </ListItem>
        </Link>
        <Link to="/accounts">
          <ListItem>
            <ListItemIcon>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText primary="계좌 관리" />
          </ListItem>
        </Link>
        <Link to="/cards">
          <ListItem>
            <ListItemIcon>
              <CreditCard />
            </ListItemIcon>
            <ListItemText primary="카드 관리" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={auth.signOut}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="로그아웃" />
        </ListItem>
      </List>
    </div>
  )
}