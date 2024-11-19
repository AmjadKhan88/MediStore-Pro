import React from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import { RouterProvider} from 'react-router-dom';
import {router} from './Routes/Routes'
import StoreContextProvider from './Context/ContextApi';
import '../node_modules/chart.js/dist/chart.js';

createRoot(document.getElementById("root")).render(
  <StoreContextProvider>
    <RouterProvider router={router} />
  </StoreContextProvider>
);
