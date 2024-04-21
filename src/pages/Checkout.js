import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userAuth } from '../redux/slices/authSlices';
import Cookies from 'js-cookie';
import { motion } from "framer-motion"

function Checkout() {

    const [isLogin, setIsLogin] = useState(Cookies.get('user'))
    const { checkedProducts = [], subtotal } = useLocation().state || {};
    const {data, loading, error} = useSelector(state => state.userAuth);
    const [coupons, setCoupons] = useState([])
    const [couponValue, setCouponValue] = useState()
    const [saved, setSaved] = useState(0)
    const [address, setAddress] = useState({
        firstName : '',
        lastName : '',
        phoneNumber : '',
        shippingAddress : ''
    })
    const [phoneErrmsg, setPhoneErrmsg] = useState()
    const [phoneDefault, setPhoneDefault] = useState(false)
    const [AddressDefault, setAddressDefault] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        setIsLogin(Cookies.get('user'))
        axios.get('http://localhost:3002/coupons')
        .then(res => setCoupons(res.data))
        if(data.length !== 0){
            setAddress({firstName : data[0].first_name, lastName : data[0].last_name, phoneNumber : data[0].phonenumber, shippingAddress : data[0].address})
        }
    }, [data])

    const couponSave = () => {
        coupons.map(v => {
            if (v.coupon_code === couponValue && (new Date(v.expiration_date) > new Date())){
                setSaved(subtotal * v.discount / 100)
            }
        })
    }

    const handelCheckPhone = (event) =>{
        const { checked } = event.target;

        if(checked){
            setPhoneDefault(true)
        }else{
            setPhoneDefault(false)
        }
    }

    const handelCheckAddress = (event) => {
        const { checked } = event.target;

        if(checked){
            setAddressDefault(true)
        }else{
            setAddressDefault(false)
        }
    }



    const handelPlaceOrder = () => {

        if(address.phoneNumber && address.shippingAddress){
            if (phoneDefault) {
                axios.put('http://localhost:3002/user/updatePhone', { phoneNumber : address.phoneNumber ,userid : data[0].user_id })
                dispatch(userAuth())
            }

            if (AddressDefault) {
                axios.put('http://localhost:3002/user/updateAddress', { address : address.shippingAddress ,userid : data[0].user_id })
                dispatch(userAuth())
            }

            try{
                axios.post('http://localhost:3002/order/placeOrder', {
                    userId : data[0].user_id,
                    totalPrice : subtotal - saved, 
                    saved : saved, 
                    shippingAddress : address.shippingAddress, 
                    checkoutProducts : checkedProducts
                }).then(res => console.log(res.data))
                console.log({
                    userId : data[0].user_id,
                    totalPrice : subtotal - saved, 
                    saved : saved, 
                    shippingAddress : address.shippingAddress, 
                    checkoutProducts : checkedProducts
                })
            } catch (error) {
                console.error('error to place order')
            }

        }
    }

    console.log(data)
  return (
    <div className='checkout-page'>
        <div className='checkout-component'>
            <motion.div className='checkout-details' 
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.7 }}>
                <div className='checkout-details-address'>
                    <h3>Shipping Address</h3>
                    <div className='checkout-details-address-info'>
                        <div className='checkout-details-address-info-input'>
                            <label className='label'>First name</label>
                            <input type='text' placeholder='First name' onChange={(e) => setAddress({...address, firstName : e.target.value})} value={data.length !== 0 && (data[0].first_name !== null ? data[0].first_name : address.firstName)} readOnly={data.length !== 0 && data[0].first_name !== null}/>
                        </div>
                        <div className='checkout-details-address-info-input'>
                            <label className='label'>Last name</label>
                            <input type='text' placeholder='Last name' onChange={(e) => setAddress({...address, lastName : e.target.value})} value={data.length !== 0 && (data[0].last_name !== null ? data[0].last_name : address.lastName)} readOnly={data.length !== 0 && data[0].last_name !== null}/>
                        </div>
                        <div className='checkout-details-address-info-input'>
                            <label className='label'>Phone Number</label>
                            <input type='text' placeholder='Phone Number' onChange={(e) => setAddress({...address, phoneNumber : e.target.value})} value={data.length !== 0 && (data[0].phonenumber !== null ? data[0].phonenumber : address.phoneNumber)}  readOnly={data.length !== 0 && data[0].phonenumber !== null}/>
                            {
                                (data.length !== 0 && data[0].phonenumber === null)
                                &&
                                <div className='set-as-default'>
                                    <input type='checkbox' onChange={handelCheckPhone}/>
                                    <label>Set as Default</label>
                                </div>
                            }
                            
                        </div>
                        <div className='checkout-details-address-info-input'>
                            <label className='label'>Address</label>
                            <input type='text' placeholder='Address' onChange={(e) => setAddress({...address, shippingAddress : e.target.value})} value={data.length !== 0 && (data[0].address !== null ? data[0].address : address.shippingAddress)}  readOnly={data.length !== 0 && data[0].address !== null}/>
                            {
                                (data.length !== 0 && data[0].address === null)
                                &&
                                <div className='set-as-default'>
                                <input type='checkbox' onChange={handelCheckAddress}/>
                                <label>Set as Default</label>
                            </div>
                            }
                            
                        </div>
                                                
                    </div>
                </div>
            </motion.div>
            <div className='checkout-payment-summary'>
                <motion.div className='checkout-payment'
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 0.7 }}>
                        <h3>Payment Methods</h3>
                        <div className='checkout-payment-method'>
                            <input type='radio'  id='cod' checked/>
                            <label htmlFor='cod'>Cash on Delivery</label>
                        </div>
                </motion.div>
                <motion.div className='checkout-summary'
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 0.7 }}>
                    <h3>Summary</h3>
                    <div className='checkout-summary-price'>
                        <div className='checkout-summary-subtotal'>
                            <div>Total item costs</div>
                            <div>{subtotal} MAD </div>
                        </div>
                        <div className='checkout-summary-saved'>
                            <div>Saved</div>
                            <div>- {saved} MAD</div>
                        </div>
                        <div className='checkout-summary-coupon'>
                            Promo code
                            <div className='summary-coupon-input'>
                                <input type='text' onChange={(e) => setCouponValue(e.target.value)}/>
                                <button onClick={() => couponSave()}>Save</button>
                            </div>
                            
                        </div>
                        <div className='checkout-summary-total'>
                            <div>Total</div>
                            <div className='checkout-summary-total-price'>{subtotal - saved} MAD</div>
                        </div>
                        <button className='summary-checkout' onClick={() => handelPlaceOrder()} >
                            Place order
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
  )
}

export default Checkout;