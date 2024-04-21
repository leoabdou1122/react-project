import React, { useEffect, useState } from 'react'
import { BsHeart, BsHeartFill  } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating'
import { BsStar, BsStarFill } from "react-icons/bs";

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

function Product({productInfo}) {

    const {data, loading, error} = useSelector(state => state.userAuth);
    const [favorite, setFavorite] = useState([]);
    const [fav, setFav] = useState(false);


    useEffect(() => {
        if(!loading) {
            axios.get(`http://localhost:3002/favorite/${data[0].favorite_id}`)
            .then(res => setFavorite(res.data))
        }
    }, [loading, fav])

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
      

  return (
    <motion.div className='products'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        <Link className='product' key={productInfo.product_id} to={`http://localhost:3000/product/${productInfo.product_id}`}>
            <div className='product-img' style={{backgroundImage: `url("/uploads/product_images/${productInfo.image_url}")`, backgroundSize: 'cover'}}>
                
                {
                    (productInfo.discount !== '0.00' && (new Date(productInfo.discount_end_date) > new Date())) && <div className='discount-percent'>{parseInt(productInfo.discount)}% Off</div>
                }
                {
                    favorite.some((f) => f.product_id === productInfo.product_id)
                    ?
                    <div className='remove-from-fav' onClick={(event) => {event.preventDefault(); removeFromFavorite(data[0].favorite_id, productInfo.product_id)}}>
                        <BsHeartFill size={25}/>
                    </div>
                    :
                    <div className='add-to-fav' onClick={(event) => {event.preventDefault(); addProductToFavorite(data[0].favorite_id, productInfo.product_id)}}>
                        <BsHeart size={25}/>
                    </div>
                }
            </div>
            <div className='product-title'>
                {productInfo.product_name}
            </div>
            <div className='product-price'>
                {
                    (productInfo.discount !== '0.00' && (new Date(productInfo.discount_end_date) > new Date()))
                    ? 
                    <>
                    <span className='new-price'>
                        <span className='currency'>MAD</span>
                            {(productInfo.product_price - (productInfo.product_price * productInfo.discount / 100)).toFixed(2)}
                        </span>
                        <span className='old-price'>MAD{productInfo.product_price}</span>
                    </>
                    : 
                    <span className='new-price'>
                        <span className='currency'>MAD</span>
                            {productInfo.product_price} 
                    </span>
                }
            </div>
            {
                (productInfo.discount !== '0.00' && (new Date(productInfo.discount_end_date) > new Date()))
                && 
                <div className='discount-end'>
                    <DiscountEndDate endDate={productInfo.discount_end_date}/>
                </div>
            }
            {
                productInfo.rating 
                && <Rating fillColor='#ff7675'  initialValue={productInfo.rating } fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
            }
        </Link>
    </motion.div>
        
  )
}

export default Product;