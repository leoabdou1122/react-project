import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Product from './Product';


function BestDeals() {

    const [bestDeals, setBestDeals] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3002/products/bestDeals')
        .then(res => setBestDeals(res.data))       
    }, [])

console.log(bestDeals)
  return (
    <div className='bestDeals-component'>
        <div className='bestDeals-title'>
            <h2>Best Deals</h2>
            <Link>See More</Link>
        </div>
        <div className='bestDeals'>
            {
                bestDeals.slice(0, 4).map((v, i) => (
                    <Product productInfo={v} key={i}/>
                ))
            }
        </div>
        
    </div>
  )
}

export default BestDeals;