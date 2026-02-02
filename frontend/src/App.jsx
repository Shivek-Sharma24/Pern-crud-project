import Navbar from "./components/Navbar"
import {Route, Routes} from 'react-router-dom'
import HomePage from "./Pages/HomePage"
import ProductPage from "./Pages/ProductPage"
import React from "react"
import { useThemeStore } from "./store/useThemeStore"
import {Toaster} from 'react-hot-toast'

function App() {
  const {theme} = useThemeStore();
  return (
    <div className="min-h-screen bg-base-200 duration-300 transition-colors" data-theme={theme}>
      <Navbar />

      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  )
}

export default React.memo(App)
