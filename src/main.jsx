import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import App from './App.jsx'
import './index.css'

const convex = new ConvexReactClient("https://notable-gnu-290.convex.cloud");



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <App />
    </ConvexAuthProvider>
  </React.StrictMode>,
)

