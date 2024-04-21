import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Product from './Product';
import SyncLoader from 'react-spinners/SyncLoader'

function PicksForYou() {

    const [products, setProducts] = useState([])
    const [page, setPage] = useState(8)
    const [isLoading, setIsLoading] = useState(true)
    const [allProductsLoaded, setAllProductsLoaded] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:3002/products')
        .then(res => {
            setProducts(res.data)
            if (res.data.length >= page) {
                setAllProductsLoaded(false)
            }else{
                setAllProductsLoaded(true)
            }
        })
        setIsLoading(false)
    }, [page])

    useEffect(() => {
        if (products.length !== 0) {
            if (products.length >= page) {
                setAllProductsLoaded(false)
            }else{
                setAllProductsLoaded(true)
            }
        }

    },[page])

    const handelProducts = () => {
            if (products.length >= page) {
                setIsLoading(true)
                setTimeout(() => {
                    setPage( prev => prev + 4 )
                }, 1500)
            }else{
                setIsLoading(false)
            }  
    }
    console.log(allProductsLoaded)
  return (
    <>
    <div className='picksForYou-component'>
        <div className='picksForYou-title'>
            <h2>Picks For You</h2>
            <Link>See More</Link>
        </div>
        <div className='picksForYou'>
            {
                products.slice(0, page).map((v, i) => (
                    <Product productInfo={v} key={i}/>
                ))
            }
        </div>
        <div className='loading'>
            <SyncLoader color="#ff7675" loading={isLoading}/>
        </div>
        {
            (!isLoading && products.length <= page)
            && 
            <div className='load-more'>
            <button onClick={() => handelProducts()} disabled={allProductsLoaded} className={allProductsLoaded ? 'disabled' : 'enabled'}>
                {allProductsLoaded ? 'No More Products' : 'Load More'}
            </button>
            </div>
        }
    </div>
    
    </>
  )
}

export default PicksForYou;