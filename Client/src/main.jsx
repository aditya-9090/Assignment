import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ToastContainer, toast } from 'react-toastify';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ToastContainer />
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
