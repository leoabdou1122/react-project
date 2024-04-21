import React, { useEffect, useState } from 'react'
import { BsPersonCircle, BsBag, BsFillSunFill  } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchUserCart } from '../redux/slices/cartSlices';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch()
  const {data, loading, error} = useSelector(state => state.userAuth)
  const {cart , cartLoading, cartError} = useSelector(state => state.userCart)
  const [isLogin, setIsLogin] = useState(Cookies.get('user'))
  const navigate = useNavigate();

  useEffect(() => { 
    if(loading === false && data.length !== 0) {
      dispatch(fetchUserCart(data[0].cart_id))
    }
    setIsLogin(Cookies.get('user'))
  }, [data, loading])


  return (
    <header>
      <div className='mobile-view'>
        <div>Logo</div>
        <BsPersonCircle size={27}/>
        <div className='cart' data-value='5'>
        <BsBag size={25}/>
        </div>
        <BsFillSunFill size={20}/>
      </div>
      
      <div className='header-container'>
        <div className='logo'>
          logo
        </div>
        <div className='search'>
          <input type='search' placeholder='Search...'/>
          <button><BiSearch size={22}/></button>
        </div>
        <div className='account'>
            <BsPersonCircle size={27}/>
          <div className='profile'>
            <span>Hello</span>
            {data.length !== 0 ? <Link to=''>{data[0].first_name}</Link> : <Link to='/signin'>Sign In</Link>}
            
          </div>
        </div>
        <div className='cart' data-value={cart.length} onClick={() => isLogin ? navigate('/cart') : navigate('/signin')}>
          <BsBag size={25}/>
        </div>
        <div className='mode'>
          <BsFillSunFill size={20}/>
        </div>
      </div>
      
    </header>
  )
}

export default Header;