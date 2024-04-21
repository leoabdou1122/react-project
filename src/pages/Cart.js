import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BsTrash3, BsCheck   } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion } from "framer-motion"

function Cart() {

    const [products, setProducts] = useState([]);
    const {data, loading, error} = useSelector(state => state.userAuth);
    const [checkedProducts, setCheckedProduct] = useState([])
    const [subtotal , setSubtotal] = useState(0)
    const [coupons, setCoupons] = useState([])
    const navigate  = useNavigate();
    const [isLogin, setIsLogin] = useState(Cookies.get('user'))

    useEffect(() => {
        setIsLogin(Cookies.get('user'))
        if(!loading){
            axios.get(`http://localhost:3002/cart/${data[0].cart_id}`)
            .then(res => {
                setProducts(res.data);
                setCheckedProduct(res.data)
                
            })
        }
        axios.get('http://localhost:3002/coupons')
        .then(res => setCoupons(res.data))
    }, [loading])

    useEffect(() => {
        if(checkedProducts){
            calcSubtotal(checkedProducts)
        }
    }, [checkedProducts])

    const deleteFromCart = async (cartId, productId, colorId, sizeId) => {
        try{
            await axios.delete('http://localhost:3002/cart/deleteFromCart', { data: { cartId, productId, colorId, sizeId }} )
            setProducts(prevProducts => prevProducts.filter(product => 
                product.product_id !== productId || 
                product.color_id !== colorId || 
                product.size_id !== sizeId
            ));
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
        
    }
    

    const isProductInArray = (cartItemId, productId) => {
        const check = checkedProducts.some((product) => product.cart_item_id === cartItemId && product.product_id === productId)
        return check
    }

    const CheckProduct = (product, cartItemId, productId) => {
        if (isProductInArray(cartItemId, productId)) {
            setCheckedProduct(prev => prev.filter(product => !(product.cart_item_id === cartItemId && product.product_id === productId)))
        }else {
            setCheckedProduct(prev => [...prev, product].sort((a, b) => b.cart_item_id - a.cart_item_id))
            
        }
    }

    const quantityIncrement = async (cartId, productId, colorId, sizeId) => {
        try {
            await axios.put('http://localhost:3002/cart/incrQuantity', { cartId, productId, colorId, sizeId })
            setProducts(prevProducts => prevProducts.map(product => {
                if (product.product_id === productId && product.color_id === colorId && product.size_id === sizeId){
                    return {
                        ...product, quantity : parseInt(product.quantity) + 1
                    };
                } else {
                    return product
                }
            }    
            ))
            setCheckedProduct(prevProducts => prevProducts.map(product => {
                if (product.product_id === productId && product.color_id === colorId && product.size_id === sizeId){
                    return {
                        ...product, quantity : parseInt(product.quantity) + 1
                    };
                } else {
                    return product
                }
            }    
            ))
        } catch (error) {
            console.error('Error increment the qunatity:', error);
        }
    }

    const quantityDecrement = async (cartId, productId, colorId, sizeId) => {
        try {
            await axios.put('http://localhost:3002/cart/decrQuantity', { cartId, productId, colorId, sizeId })
            setProducts(prevProducts => prevProducts.map(product => {
                if (product.product_id === productId && product.color_id === colorId && product.size_id === sizeId){
                    return {
                        ...product, quantity : parseInt(product.quantity) - 1
                    };
                } else {
                    return product
                }
            }    
            ))
            setCheckedProduct(prevProducts => prevProducts.map(product => {
                if (product.product_id === productId && product.color_id === colorId && product.size_id === sizeId){
                    return {
                        ...product, quantity : parseInt(product.quantity) - 1
                    };
                } else {
                    return product
                }
            }    
            ))

        } catch (error) {
            console.error('Error increment the qunatity:', error);
        }
    }

    const areArraysEqual = (array1, array2) => {
        if (array1.length !== array2.length) {
            return false;
        }
        
        const sortedArray1 = array1.slice().sort((a, b) => a.cart_item_id - b.cart_item_id);
        const sortedArray2 = array2.slice().sort((a, b) => a.cart_item_id - b.cart_item_id);
    
        return JSON.stringify(sortedArray1) === JSON.stringify(sortedArray2);
    };

    const checkallProducts = () => {
        if(areArraysEqual(products, checkedProducts)){
            setCheckedProduct([])
        }else{
            setCheckedProduct(products)
        }
    }

    const calcSubtotal = (p) => {
        let subtotal = 0;
        p.map(product => {
            if((product.discount != '0.00' && (new Date(product.discount_end_date) > new Date()))){
                subtotal += ((parseFloat(product.product_price) - (parseFloat(product.product_price) * parseFloat(product.discount) / 100)) * product.quantity).toFixed(2)
            }else {
                subtotal += parseFloat(product.product_price * product.quantity)
            }
        })
        setSubtotal(subtotal)
    }

    const handleCheckout = () => {
        if(isLogin){
            navigate('/checkout', { state: { checkedProducts, subtotal } });
        }else{
            navigate('/signin');
        }
        
    };

    console.log(coupons)
  return (
    <div className='cart-page'>
        <motion.div className='shopping-cart'
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ duration: 0.7 }}>
            <h2>Shopping Cart ({products.length})</h2>
            <div className='shopping-cart-checkall'>
                <div className='shopping-cart-checkall-check'>
                    <input className='shopping-cart-checkall-check-input' type='checkbox' checked={areArraysEqual(products, checkedProducts)}/>
                        <div className='shopping-cart-checkall-check-label' onClick={() => checkallProducts()}>
                        <BsCheck size={20}/>
                    </div>
                </div>
                <div className='shopping-cart-checkall-title'>
                    Select all items
                </div>
            </div>
            <div className='cart-products'>
                {
                    products.length !== 0
                    &&
                    products.map((v, i) => (
                        <div className='cart-product' key={i}>
                            <div className='cart-product-check'>
                                <input className='cart-product-check-input' type='checkbox' checked={isProductInArray(v.cart_item_id, v.product_id)}/>
                                <div className='cart-product-check-label' onClick={() => CheckProduct(v, v.cart_item_id, v.product_id)}>
                                    <BsCheck size={20}/>
                                </div>
                            </div>
                            <div className='cart-product-image' style={{backgroundImage: `url("/uploads/product_images/${v.image_url}")`, backgroundSize: 'cover'}}></div>
                            <div className='cart-product-info'>
                                <div className='cart-product-title'><Link to={`/product/${v.product_id}`}>{v.product_name}</Link></div>
                                <div className='cart-product-color-size'>
                                    <div className='cart-product-color'>
                                        <div className='color_value' style={{backgroundColor : `${v.color_value}`}}></div>
                                        <div className='color_name'>{v.color_name}</div>
                                    </div>
                                    /
                                    <div className='cart-product-size'>{v.size_name}</div>
                                </div>
                                <div className='cart-product-price-quantity'>
                                    <div className='cart-product-price'>
                                        {
                                            (v.discount != '0.00' && (new Date(v.discount_end_date) > new Date()))
                                            ?
                                            <>
                                                <div className='cart-product-price-new'>
                                                    <div className='cart-product-price-currency'>MAD</div>
                                                    <div className='cart-product-price-value'>
                                                        {(v.product_price - (v.product_price * v.discount / 100)).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className='cart-product-price-old'>
                                                    <div className='cart-product-price-currency'>MAD</div>
                                                    <div className='cart-product-price-value'>{v.product_price}</div>
                                                </div>
                                                <div className='cart-product-price-discount'>
                                                    -{parseInt(v.discount)}%
                                                </div>
                                            </>
                                            :
                                            <div className='cart-product-price-new'>
                                                <div className='cart-product-price-currency'>MAD</div>
                                                <div className='cart-product-price-value'>{v.product_price}</div>
                                            </div>
                                        }
                                        
                                    </div>
                                </div>
                                <div className='cart-product-quantity-remove'>
                                    <div className='cart-product-quantity'>
                                        <button onClick={() => quantityDecrement(data[0].cart_id, v.product_id, v.color_id, v.size_id)}>-</button>
                                        <input type='number' value={v.quantity} readOnly/>
                                        <button onClick={() => quantityIncrement(data[0].cart_id, v.product_id, v.color_id, v.size_id)}>+</button>
                                    </div>
                                    <div className='cart-product-remove' onClick={() => deleteFromCart(data[0].cart_id, v.product_id, v.color_id, v.size_id)}>
                                        <BsTrash3 />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </motion.div>
        <motion.div className='summary'
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{ duration: 0.7 }}>
            <h2>Summary</h2>
            <div className='summary-price'>
                <div className='summary-subtotal'>
                    <div>Subtotal {`(${checkedProducts.length})`}</div>
                    <div>{subtotal} MAD </div>
                </div>
                <div className='summary-total'>
                    <div>Total</div>
                    <div className='summary-total-price'>{subtotal} MAD</div>
                </div>
                <button className='summary-checkout' onClick={handleCheckout}>
                    Checkout
                </button>
            </div>
        </motion.div>
    </div>
  )
}

export default Cart;