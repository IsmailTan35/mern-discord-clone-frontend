import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import store from 'store';
import App from 'App';
import axios from 'axios';
import {url} from "controller/Context";
import "assets/style/index.css";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = url ;
console.log(url)
axios.defaults.headers.common['Authorization'] = localStorage.getItem('accessToken');

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}> 
      <App />
     </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
