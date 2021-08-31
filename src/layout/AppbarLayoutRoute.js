import { Container, ListItem, List, Drawer } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import DefaultAppBar from "../component/DefaultAppBar";
import {useAuth} from '../context/AuthContext';
import Routing from "../config/Routing";
import { useHistory } from "react-router";
import { isNil } from "lodash";
const listItems = [
  {label: 'Thu thập thông tin', pathname: Routing.PATIENTINFO},
  {label: 'Theo dõi bệnh nhân nặng', pathname: Routing.ICU, user_type: 'icu-doctor'},
  {label: 'Hồ sơ bệnh nhân', pathname: Routing.PATIENTBOOK }
]

const AppbarLayout = function({children}) {
  let {userInfo, signOut} = useAuth()
  const history = useHistory()
  const [menuState, setMenuState] = useState(false)
  useEffect(() => {
    if(window.innerWidth > 600){
      setMenuState(false)
    }
  },[])
  let currentTitle = ''
  const visibleItems = []
  listItems.map((item) => {
    item.selected = false;
    if(userInfo === undefined){return 0}
    if(item.pathname === history.location.pathname){
      item.selected = true
      currentTitle = item.label
    }
    if(item.user_type === undefined || 
      (item.user_type !== undefined && userInfo.type === item.user_type)
    ){
      visibleItems.push(item)
    }
    return 0
  })
  return (
    <Container maxWidth="md">
      <DefaultAppBar title={currentTitle} menuHandler={() => {
        setMenuState(!menuState)
      }}/>
      <div>
        <Drawer open={menuState} anchor={"left"} onClose={() => setMenuState(false)}>
          <List>
            <ListItem>
              { isNil(userInfo) !== true ? userInfo.name: ""}
            </ListItem>
            {
              visibleItems.map((list, idx) => {
                return <ListItem onClick={() => history.push({
                  pathname: list.pathname
                })} selected={list.selected} key={idx}>
                  {list.label}
                </ListItem>
              })
            }
          </List>
          <ListItem onClick={() => signOut()}>
            Đăng xuất
          </ListItem>
        </Drawer>  
        {children}
      </div>
    </Container>
  )
}

const AppbarLayoutRoute = function({component: Component, ...props}){
  return (
    <Route path={props.path} render={(props) => {
      return (
        <AppbarLayout>
          <Component {...props} />
        </AppbarLayout>
      )
    }} 
    exact />
  )
}

export default AppbarLayoutRoute;