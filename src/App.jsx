import Panel from 'layouts/Panel';

import {SocketContext, client} from 'controller/Context';
import LandingPage from 'layouts/LandingPage';
import Auth from 'layouts/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import SocketController from 'controller/SocketController';
import { Route, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import Dashboard from 'views/Dashboard';
import { useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const location = useLocation();
  const navigate = useHistory()
  // useEffect(() => {
  //   axios.post('/api/auth/check',{
  //     userAccessToken:localStorage.getItem('accessToken'),
  //     userRefreshToken:localStorage.getItem('refreshToken')
  //   }).then(res => {
  //     console.log(res)
  //       navigate.push('/channel/@me')
  //   })
  //   .catch(err => {
  //     localStorage.removeItem('accessToken');
  //     localStorage.removeItem('refreshToken');
  //     if( location.pathname !== '/' && location.pathname.search('auth')=== 0){
  //       navigate.push('/auth/login')
  //     }
  //   })
  // },[location.pathname])
  return (
    <>
      <SocketContext.Provider value={client}>
        <SocketController/>
        <Route exact path="/" component={LandingPage} />
        <Route strict path="/auth" component={Auth} />
        <Route path="/channels/@me" component={Panel} />
        <Route path="/channels/Server" component={Panel} />
        <Route path="/store" component={Panel} />
      </SocketContext.Provider>
    </> 
  );
}

export default App;
