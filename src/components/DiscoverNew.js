import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Product from './Product';


function DiscoverNew() {

    const [newProducts, setNewProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3002/products/newProducts')
        .then(res => setNewProducts(res.data))       
    }, [])

    
  return (
    <div className='discoverNew-component'>
        <div className='discoverNew-title'>
            <h2>Discover New</h2>
            <Link to='/'>See More</Link>
        </div>
        <div className='discoverNew'>
            {
                newProducts.slice(0, 4).map((v, i) => (
                    <Product productInfo={v} key={i}/>
                ))
            }
        </div>
    </div>
  )
}

export default DiscoverNew;