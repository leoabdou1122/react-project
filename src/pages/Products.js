import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Product from '../components/Product';
import SearchInputWithCheckboxFilter from '../components/colorsFilter';
import StarsFilter from '../components/starsFilter';
import SizesFilter from '../components/sizesFilter';
import PriceFilter from '../components/priceFilter';
import { BsChevronDown  } from "react-icons/bs";
import { motion } from "framer-motion"


function Products() {

    const {category_name} = useParams()
    const [products, setProducts] = useState([])
    const [downBar, setDownBar] = useState({
      stars : true,
      price : true
    })

    const [filterParam, setFilterParam] = useState({
      rating : 0,
      price : {min : 0, max : Infinity}
    })


    useEffect(() => {
      axios.get(`http://localhost:3002/products/category/${category_name}`)
      .then(res => setProducts(res.data))
      setFilterParam({
        rating : 0,
        price : {min : 0, max : Infinity}
      })
    }, [category_name])

    useEffect(() => {
      if(filterParam.rating == 0) {
        axios.get(`http://localhost:3002/products/category/${category_name}`)
        .then(res => setProducts(res.data.filter(item =>  
          (item.product_price - item.product_price * item.discount / 100) >= parseFloat(filterParam.price.min).toFixed(2)
          && 
          (item.product_price - item.product_price * item.discount / 100) <= parseFloat(filterParam.price.max).toFixed(2)
        )))
      }else{
        const newList = products.filter(item =>  
          (item.rating >= filterParam.rating)
          &&
          (item.product_price - item.product_price * item.discount / 100) >= parseFloat(filterParam.price.min).toFixed(2)
          && 
          (item.product_price - item.product_price * item.discount / 100) <= parseFloat(filterParam.price.max).toFixed(2)
        )
        setProducts(newList)
      }
      
    }, [filterParam])

    const handelDownBar = (bar) => {
      switch (bar) {
        case "stars":
          setDownBar({...downBar, stars : !downBar.stars})
          break;
        case "price":
          setDownBar({...downBar, price : !downBar.price})
          break;
        default :

      }
    }

const setStarsFilter = (stars) => {
  setFilterParam({...filterParam, rating : stars})
}


const setPriceFilter = (minPrice, maxPrice) => {
  setFilterParam({...filterParam, price : {min : minPrice, max : maxPrice}})
}

console.log(filterParam.rating)
console.log(filterParam.price)

    /*const filterByStars = (rating) => {
      if(rating == 0) {
        axios.get(`http://localhost:3002/products/category/${category_name}`)
        .then(res => setProducts(res.data))
      }else{
        const newList = products.filter(item => item.rating >= rating)
        setProducts(newList)
      }
    }*/

    /*const filterByPrice = (min, max) => {
      console.log(min, typeof(parseFloat(min).toFixed(2)))
      axios.get(`http://localhost:3002/products/category/${category_name}`)
      .then(res => setProducts(res.data.filter(item =>  (item.product_price - item.product_price * item.discount / 100) >= parseFloat(min).toFixed(2) && (item.product_price - item.product_price * item.discount / 100) <= parseFloat(max).toFixed(2))))
    }*/


  return (
    <div className='products-page'>
        <h2>{category_name} Category</h2>
        <div className='filter-products'>
          <div className='filter'>
            <motion.div className='filters'
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.7 }}>
              <div className='down-bar' onClick={() => handelDownBar('stars')}>
                <span>Reviews</span>
                <BsChevronDown/>
              </div>
              {
                downBar.stars && <StarsFilter setStars={setStarsFilter} rating={filterParam.rating}/>
              }
              <div className='down-bar' onClick={() => handelDownBar('price')}>
                <span>Price</span>
                <BsChevronDown />
              </div>
              {
                downBar.price && <PriceFilter setPrice={setPriceFilter} min={filterParam.price.min} max={filterParam.price.max}/>
              }
            </motion.div>
              
              
              
          </div>
          <div className='product-list-sort'>
            <div className='sort'>
              <select>
                <option value="someOption">By default</option>
                <option value="otherOption">By price : low to high </option>
                <option value="otherOption">By price : high to low </option>
                <option value="otherOption">By date : newest first </option>
                <option value="otherOption">By date : oldest first </option>
              </select>
            </div>
            <div className='products-list'>
              {
                products.map((v, i) => (
                  <Product productInfo={v} key={i}/>
                )
              )
              }
            </div>
          </div>
        </div>
    </div>
  )
}

export default Products;