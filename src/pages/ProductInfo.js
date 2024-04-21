import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Rating } from 'react-simple-star-rating'
import { BsStar, BsStarFill } from "react-icons/bs";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { BsHeart, BsHeartFill  } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { BsPersonCircle } from "react-icons/bs";
import SyncLoader from 'react-spinners/SyncLoader';
import Cookies from 'js-cookie';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import '../style/global.css';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { fetchUserCart } from '../redux/slices/cartSlices';
import { useDispatch } from 'react-redux';
import ProductDescriptionEditor from '../components/DescriptionInput';
import Product from '../components/Product';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"


function DiscountEndDate ({endDate}) {
    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const discountEndDate = new Date(endDate).getTime();
        const timeDifference = discountEndDate - now;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]); // Update interval when endDate changes

    return (
        <>
            <div className='time-left'>
                <div>{timeLeft.days}d</div>:
                <div>{String(timeLeft.hours).padStart(2, '0')}</div>:
                <div>{String(timeLeft.minutes).padStart(2, '0')}</div>:
                <div>{String(timeLeft.seconds).padStart(2, '0')}</div>
            </div>
        </>
    )
}

function ProductInfo() {

    const dispatch = useDispatch()
    const {data, loading, error} = useSelector(state => state.userAuth);
    const [isLogin, setIsLogin] = useState(Cookies.get('user'))
    const {product_id} = useParams()
    const [productInfo, setProductInfo] = useState([])
    const [image, setImage] = useState([])
    const [colors, setColors] = useState([])
    const [sizes, setSizes] = useState([])
    const [numberOfSold, setNumberOfSold] = useState([])
    const [reviews, setReviews] = useState([])
    const [colorSelected, setColorSelected] = useState({
        value : '',
        name : ''
    })
    const [sizeSelected, setSizeSelected] = useState({
        value : '',
        name : ''
    })
    const [descReview, setDescReview] = useState('desc')
    const [quantity, setQuantity] = useState(1);
    const [favorite, setFavorite] = useState([]);
    const [fav, setFav] = useState(false);
    const [colorErr, setColorErr] = useState(null)
    const [sizeErr, setSizeErr] = useState(null)
    const [mayAlsoLike, setMayAlsoLike] = useState([])
    const [page, setPage] = useState(8)
    const [isLoading, setIsLoading] = useState(true)
    const [allProductsLoaded, setAllProductsLoaded] = useState(false);
    const handelChangeColor = (checked, value, name) => {

        if(checked) {
            setColorSelected({value : value, name : name})
        }
    }

    const handelChangeSize = (checked, value, name) => {
        if (checked) {
            setSizeSelected({value : value, name : name})
        }
    }
    const navigate = useNavigate();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    useEffect(() => {
        setIsLogin(Cookies.get('user'))
        axios.get(`http://localhost:3002/products/${product_id}`)
        .then(res => {
            setProductInfo(res.data['product']); 
            setImage(res.data['images']);
            setColors(res.data['colors'])
            setSizes(res.data['sizes'])
            setReviews(res.data['review'])
            axios.get(`http://localhost:3002/products/category/${res.data['product'][0]['category_name']}`)
            .then(resp => {
                setMayAlsoLike(resp.data);
                if (resp.data.length >= page) {
                    setAllProductsLoaded(false)
                }else{
                    setAllProductsLoaded(true)
                }
            })
            setIsLoading(false)
        })
        axios.get(`http://localhost:3002/products/productSold/${product_id}`)
        .then(res => setNumberOfSold(res.data))
        
    }, [product_id])

    useEffect(() => {
        if(!loading) {
            axios.get(`http://localhost:3002/favorite/${data[0].favorite_id}`)
            .then(res => setFavorite(res.data))
        }
    }, [loading, fav])

    useEffect(() => {
        if (mayAlsoLike.length !== 0) {
            if (mayAlsoLike.length >= page) {
                setAllProductsLoaded(false)
            }else{
                setAllProductsLoaded(true)
            }
        }

    },[page])

    const handelProducts = () => {
        if (mayAlsoLike.length >= page) {
            setIsLoading(true)
            setTimeout(() => {
                setPage( prev => prev + 4 )
            }, 1500)
        }else{
            setIsLoading(false)
        }  
}

    const addProductToFavorite = (favoriteId, productId) => {
        try {
            axios.post('http://localhost:3002/favorite/addToFavorite', {favoriteId, productId}).then(() => setFav(true))
        } catch (error) {
            console.log('Error add product to favorite :', error)
        }
    }

    const removeFromFavorite = async (favoriteId, productId) => {
        try {
          await axios.delete('http://localhost:3002/favorite/removeFromFavorite',{ data: { favoriteId, productId }}).then(() => setFav(false))
        } catch (error) {
          console.error('Error removing product from favorites:', error);
          // Handle errors gracefully (e.g., display error message to user)
        }
      };

    
      const addToCart = async (cartId, productId, color, size, quantity) => {
        if (color === '') {
            setColorErr('choose color !');
        }
        if (size === '') {
            setSizeErr('choose size !');
        }
        if (color !== '' && size !== '') {
            try {
                await axios.post('http://localhost:3002/cart/addToCart', { cartId, productId, color, size, quantity }, { withCredentials: true });
                // Fetch updated cart from the server and update Redux store
                dispatch(fetchUserCart(cartId));
                console.log('Product added with id:', productId);
            } catch (error) {
                console.error('Error adding product to cart:', error);
                // Handle errors gracefully (e.g., display error message to user)
            }
        }
    };

    console.log(mayAlsoLike)
    return (
        <>
        <div className='product-page'>
            <div className='images-info'>
                <motion.div  className='product-images'
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 1 }}>
                    {image.length > 0 && (
                        <>
                            <Swiper
                                style={{
                                    "--swiper-navigation-color": "#fff",
                                    "--swiper-pagination-color": "#fff",
                                }}
                                loop={true}
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper2"
                            >
                                
                                {
                                    image.map((v, i) => (
                                        <SwiperSlide key={v.image_id} style={{backgroundImage: `url("/uploads/product_images/${v.image_url}")`, backgroundSize: 'cover'}}/>
                                    ))
                                }
                            </Swiper>
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={true}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                
                                {
                                    image.map((v, i) => (
                                        <SwiperSlide key={v.image_id} style={{backgroundImage: `url("/uploads/product_images/${v.image_url}")`, backgroundSize: 'cover'}}/>
                                    ))
                                }
                            </Swiper>
                        </>
                    )}
                </motion.div >
                <motion.div className='product-info'
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 1 }}>
                    {
                        productInfo.length 
                        &&
                        <div className='info'>
                            {
                                (productInfo[0].discount !== '0.00' && (new Date(productInfo[0].discount_end_date) > new Date()))
                                &&
                                <div className='discount'>
                                {
                                    <>Ends: <DiscountEndDate endDate={productInfo[0].discount_end_date}/> </>
                                }
                                </div>
                            }
                            <div className='title'>{productInfo[0].product_name}</div>
                            <div className='rating-sold'>
                                {
                                    productInfo[0].rating 
                                    &&
                                    <>
                                        <div className='rating'>
                                            <Rating fillColor='#ff7675'  initialValue={productInfo[0].rating } fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
                                        </div>
                                        {
                                            reviews 
                                            &&
                                            <div className='number-reviews'>
                                                <span>{reviews.length}</span>
                                                <span>{reviews.length === 1 ? 'Review' : 'Reviews'}</span>
                                            </div>
                                        }
                                        <span>
                                        |
                                        </span>
                                    </>
                                }
                                {
                                    numberOfSold.length !== 0
                                    && 
                                    <div className='sold-number'>
                                        <span>{numberOfSold.length}</span>
                                        <span>Sold</span>
                                    </div>
                                }
                            </div>
                            <div className='the-product-price'>
                                {
                                    (productInfo[0].discount !== '0.00' && (new Date(productInfo[0].discount_end_date) > new Date()))
                                    ?
                                    <>
                                        <div className='the-new-price'>
                                            <span className='currency'>MAD</span>
                                            <span>{(productInfo[0].product_price - (productInfo[0].product_price * productInfo[0].discount / 100)).toFixed(2)}</span>
                                        </div>
                                        <div className='the-old-price'>
                                            <span className='currency'>MAD</span>
                                            <span>{productInfo[0].product_price}</span>
                                        </div>
                                        <div className='discount-value'>
                                            -{parseInt(productInfo[0].discount)}%
                                        </div>
                                    </>
                                    :
                                    <div className='the-new-price'>
                                        <span className='currency'>MAD</span>
                                        <span>{(productInfo[0].product_price - (productInfo[0].product_price * productInfo[0].discount / 100)).toFixed(2)}</span>
                                    </div>
                                }
                                
                            </div>
                        </div>
                    }
                    <div className='colors'>
                        
                        <div className='color-title'>Color : <span>{colorSelected.name}</span>{colorErr && <span className='error-msg'>{colorErr}</span>}</div>
                        {
                            colors.length !== 0 
                            &&
                            <>
                            <div className='all-colors'>
                                {
                                    colors.map((v, i) => (
                                        <div  key={i} className='color-input'> 
                                            <input type='radio' name='color' value={v.color_id} checked={colorSelected.value === v.color_id} onChange={(e) => handelChangeColor(e.target.checked, v.color_id, v.color_name)}/>
                                            <div className='color' style={{backgroundColor : `${v.color_value}`}} onClick={() => {setColorSelected({value : v.color_id, name : v.color_name}); setColorErr(null)}}></div>
                                        </div>
                                    ))
                                }
                            </div>
                            </>
                        }
                    </div>
                    <div className='sizes'>
                        
                        <div className='size-title'>Size : <span>{sizeSelected.name}</span>{sizeErr && <span className='error-msg'>{sizeErr}</span>}</div>
                        <div className='all-sizes'>
                            {
                                sizes.map((v, i) => (
                                    <div  key={i} className='size-input'>
                                        <input type='radio' name='size' checked={sizeSelected.value === v.size_id} onChange={(e) => handelChangeSize(e.target.checked, v.size_id, v.size_name)}/>
                                        <div className='size' onClick={() => {setSizeSelected({value : v.size_id, name : v.size_name}); setSizeErr(null)}}>{v.size_name}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className='quantity'>
                        <div className='quantity-title'>Quantity :</div>
                        <div className='quantity-input'>
                            <button onClick={() => {quantity > 0 && setQuantity(prev => prev - 1)}}>-</button>
                            <input type='number' readOnly value={quantity}/>
                            <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
                        </div>
                    </div>
                    <div className='order-cart'>
                        <button className='add-to-cart' onClick={() => { isLogin ? addToCart(data[0].cart_id, productInfo[0].product_id, colorSelected.value, sizeSelected.value, quantity)  : navigate('/signin')}}>Add to Cart</button>
                        <button className='buy-now'>Buy now</button>
                        {
                            favorite.some((f) => f.product_id === productInfo[0].product_id)
                            ?
                            <button className='remove-from-fav' onClick={() => removeFromFavorite(data[0].favorite_id, productInfo[0].product_id)}>
                                <BsHeartFill size={20}/>
                            </button>
                            :
                            <button className='add-to-fav' onClick={() => addProductToFavorite(data[0].favorite_id, productInfo[0].product_id)}>
                                <BsHeart size={20}/>
                            </button>
                        }
                        
                    </div>
                </motion.div>
            </div>
            {
                productInfo.length 
                &&
                <>
                    <motion.div  className='check-desc-review'
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    transition={{ duration: 1 }}>
                        <div className='desc-input'>
                            <input type='radio' name='desc-review' checked={descReview === 'desc'}/>
                            <div className='check-desc' onClick={() => setDescReview('desc')}>
                                Description
                            </div>
                        </div>
                        {
                            (productInfo[0].rating && reviews)
                            &&
                            <div className='review-input'>
                                <input type='radio' name='desc-review' checked={descReview === 'review'}/>
                                <div className='check-review' onClick={() => setDescReview('review')}>
                                    Reviews
                                </div>
                            </div>
                        }
                    </motion.div >
                    {
                        descReview === 'desc'
                        ?
                        <motion.div  className='desc-review'
                        initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 1 }}>
                        <div className='product-desc'>
                            <pre>{productInfo[0].product_desc}</pre>
                        </div>
                        </motion.div >
                        :
                        <motion.div  className='product-reviews'
                        initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ duration: 1 }}>
                            {
                                reviews.map((v, i) => (
                                    <div className='review'>
                                        <div className='review-user'>
                                            <BsPersonCircle size={30} color='#808080'/>
                                            <div className='name-rate'>
                                                <div className='name'>{v.first_name}</div>
                                                <div className='rate'>
                                                    <Rating fillColor='#ff7675'  initialValue={v.stars} fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className='review-date'>
                                                {new Date(v.review_date).toISOString().split('T')[0]}
                                        </div>
                                    </div>
                                ))
                            }
                        </motion.div >
                    }
                    
                </>
            }
            <div className='mayAlsoLike-component'>
                <div className='mayAlsoLike-title'>
                    <h2>You may also like</h2>
                </div>
                <div className='mayAlsoLike'>
                    {
                        mayAlsoLike.filter(v => v.product_id != product_id).map((v, i) => (
                            <Product productInfo={v} key={i}/>
                        ))
                    }
                </div>
                <div className='loading'>
                    <SyncLoader color="#ff7675" loading={isLoading}/>
                </div>
                {
                    (!isLoading && mayAlsoLike.length <= page)
                    && 
                    <div className='load-more'>
                    <button onClick={() => handelProducts()} disabled={allProductsLoaded } className={allProductsLoaded ? 'disabled' : 'enabled'}>
                        {allProductsLoaded ? 'No More Products' : 'Load More'}
                    </button>
                    </div>
                }
            </div>
        </div>
        </>
    )
    
}

export default ProductInfo;
