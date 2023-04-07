import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import ProductDetails from '../pages/ProductDetails'
import Account from '../pages/Account'
import Products from '../pages/Products'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Location from '../pages/Location'
import LocationDetail from '../pages/LocationDetail'

import AddProduct from '../admin/AddProduct'
import AllProduct from '../admin/AllProduct'
import ProtetedRoute from './ProtetedRoute'
import Dashboard from '../admin/Dashboard'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function Routers() {
  return (
    <PayPalScriptProvider options={{"client-id":"dsssdsd"}}>
      <Routes>
        <Route path='/' element={<Navigate to='home' />} />
        <Route path='home' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='cart' element={<Cart />} />
        <Route path='products' element={<Products />} />
        <Route path='checkout' element={<Checkout />} />
        <Route path='products/:id' element={<ProductDetails />} />
        <Route path='account' element={<Account />} />
        <Route path='contact' element={<Contact />} />
        <Route path='project' element={<Location />} />
        <Route path='project/:id' element={<LocationDetail />} />
      </Routes>
    </PayPalScriptProvider>
    
  )
}

export default Routers