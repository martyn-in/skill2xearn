import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom';

const convex = new ConvexReactClient("https://handsome-pika-878.convex.cloud");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexAuthProvider>
  </React.StrictMode>,
)

