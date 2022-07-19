import Panel from 'layouts/Panel';

import {SocketContext, client} from 'controller/Context';
import LandingPage from 'layouts/LandingPage';
import SocketController from 'controller/SocketController';
import { Routes,Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Auth from 'layouts/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from 'views/Dashboard';
import { useEffect } from 'react';
import axios from 'axios';
import LoginPage from 'components/auth/Login';
import Register from 'components/auth/Register';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { userActions } from 'store';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(userActions.refresh({name:"token",value:localStorage.getItem("accessToken")}))
  }, [])
  
  // useEffect(() => {
  //   axios.post('/api/auth/check',{
  //     userAccessToken:localStorage.getItem('accessToken'),
  //     userRefreshToken:localStorage.getItem('refreshToken')
  //   }).then(res => {
  //       navigate('/channel/@me')
  //   })
  //   .catch(err => {
  //     localStorage.removeItem('accessToken');
  //     localStorage.removeItem('refreshToken');
  //     if( location.pathname !== '/' && location.pathname.search('auth')=== 0){
  //       navigate('/auth/login')
  //     }
  //   })
  // },[location.pathname])
  return (
    <>
      <SocketContext.Provider value={client}>
        <SocketController/>
        <Routes>
          <Route exact path="/" element={<LandingPage/>} />
          <Route strict path="auth/" element={<Auth/>} >
              <Route path="login" element={<LoginPage/>}/>
              <Route path="register" element={<Register/>}/>
              <Route path="forgot" element={<Register/>}/>
          </Route>
          <Route path="/" element={<Panel/>} >
            <Route path="store" element={<Dashboard/>}/>
            <Route path="channels/*" exact element={<Dashboard/>}/>
            <Route path="channels" exact element={<Navigate to={"/channels/@me"}/>}/>
          </Route>
        </Routes>
      </SocketContext.Provider>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme='colored'
        limit={2}
        />
    </> 
  );
}

export default App;
