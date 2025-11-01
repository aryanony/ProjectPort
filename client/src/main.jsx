
import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.jsx'
  import './global.css'
// import AdminDashboard from './pages/AdminDashboard.jsx'

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
      {/* <AdminDashboard /> */}
    </React.StrictMode>,
  )