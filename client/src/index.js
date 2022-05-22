import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import "./App.css"
import { store } from "./Redux/store.js";
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';


ReactDOM.render(
  <BrowserRouter>
     <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

