import React from 'react'
import Header from '../components/Header';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
function Container() {
  return (
    <>
      <div className='header-navbar'>
        <Header/>
        <Navbar/>
      </div>
      <Outlet/>
    </>
  )
}

export default Container;