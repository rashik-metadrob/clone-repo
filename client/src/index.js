import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux";
import global from "./redux/global";

import { persistStore } from "redux-persist";
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./modules/shopify/providers";

let persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));

if(global.IS_SHOPIFY){
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PolarisProvider>
            <BrowserRouter basename={process.env.REACT_APP_HOMEPAGE}>
              <AppBridgeProvider>
                <QueryProvider>
                  <App />
                </QueryProvider>
              </AppBridgeProvider>
            </BrowserRouter>
          </PolarisProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}
else{
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter basename={process.env.REACT_APP_HOMEPAGE}>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
