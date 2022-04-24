import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import store from 'store';
import App from 'App';
import axios from 'axios';
import {url} from "controller/Context";
axios.defaults.baseURL = url;
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
console.log(url)
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
