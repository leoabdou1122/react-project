import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Navbar() {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        try {
            axios.get('http://localhost:3002/category')
            .then (res => setCategories(res.data))
        } catch (error) {
            console.log('error to get categories', error)
        }
    }, [])

    console.log(categories)
  return (
    <div className='navbar'>
        <ul>
            {
                categories.map(v => (
                    <Link to={`/category/${v.category_name}`} key={v.category_id}>
                        <li className='navbar-category' >{v.category_name}</li>
                    </Link>
                ))
            }
        </ul>
    </div>
  )
}

export default Navbar;