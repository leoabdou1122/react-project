import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';
function Categories() {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        try {
            axios.get('http://localhost:3002/category')
            .then (res => setCategories(res.data))
        } catch (error) {
            console.log('error to get categories', error)
        }
    }, [])

  return (
    <div className='categories-component'>
        <motion.h2 initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}>Categories</motion.h2>
        <motion.div className='categories'>
            {
                categories.map(v => (
                    <Link to={`/category/${v.category_name}`} className='category' key={v.category_id}>
                        
                            <img src={`/uploads/category-images/${v.categorie_image}`} alt='none' className='category-img'/>
                            <div className=''>
                                {v.category_name}
                            </div>
                        
                    </Link>
                    
                    
                ))
            }
        </motion.div>
    </div>
  )
}

export default Categories;