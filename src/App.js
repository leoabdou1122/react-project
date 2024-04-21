import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Container from './pages/Container';
import './style/global.css'
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { userAuth } from './redux/slices/authSlices';
import AddProductForm from './pages/productAdd';
import Products from './pages/Products';
import Home from './pages/Home';
import ImageUploadForm from './pages/sliderAdd';
import ProductInfo from './pages/ProductInfo';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';


function App() {

  const [isLogin, setIsLogin] = useState(Cookies.get('user'))
  const dispatch = useDispatch()

  useEffect(() => {
    setIsLogin(Cookies.get('user'))
    if(isLogin){
      dispatch(userAuth())
    }
  }, [dispatch, setIsLogin])
  
  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Container/>}>
          <Route index element={<Home/>}/>
          <Route path='signup' element={isLogin ? <Navigate to='/'/> : <SignUp/>}/>
          <Route path='signin' element={isLogin ? <Navigate to='/'/> : <SignIn/>}/>
          <Route path='category'>
            <Route path=':category_name' element={<Products/>}/>
          </Route>
          <Route path='product'>
            <Route path=':product_id' element={<ProductInfo/>}/>
          </Route>
            <Route path='cart' element={<Cart/>}/>
        </Route>
        <Route path='/checkout' element={<Checkout/>}/>



        <Route path='/add' element={<AddProductForm/>}/>
        <Route path='/slideradd' element={<ImageUploadForm/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App;