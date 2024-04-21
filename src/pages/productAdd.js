import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductDescriptionEditor from '../components/DescriptionInput';

const AddProductForm = () => {
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])

  const [productData, setProductData] = useState({
    product_name: '',
    product_desc: '',
    product_price: '',
    discount: '',
    discount_end_date: '',
    quantity: '',
    sizes: [],
    images: [],
    category : '',
    colors : []
  });


  useEffect(() => {
    axios.get('http://localhost:3002/category').then(res => setCategories(res.data))
    axios.get('http://localhost:3002/colors').then(res => setColors(res.data))
  }, [])


  const handleChange = e => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    console.log(productData)
    try {
      const formData = new FormData();
      formData.append('product_name', productData.product_name);
      formData.append('product_desc', productData.product_desc);
      formData.append('product_price', productData.product_price);
      formData.append('discount', productData.discount);
      formData.append('discount_end_date', productData.discount_end_date);
      formData.append('quantity', productData.quantity);

      productData.sizes.forEach(size => {
        formData.append('sizes', size);
      });
      productData.images.forEach(image => {
        formData.append('image_urls', image);
      });
      formData.append('category_id', productData.category);
      productData.colors.forEach(color => {
        formData.append('colors', color)
      })

      const response = await axios.post('http://localhost:3002/products/addProduct', formData, { withCredentials: true });
      console.log('Product added with ID:', response.data.productId);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleFileChange = e => {
    setProductData({ ...productData, images: [...productData.images, ...e.target.files] });
  };

  const HandelChangeCategory = (e) => {
    setProductData({...productData, category : e.target.value})
  }


  const handleCheckboxChange = (e, size) => {
    const { checked } = e.target;
    let updatedSizes = [...productData.sizes];
    if (checked) {
      updatedSizes.push(size);
    } else {
      updatedSizes = updatedSizes.filter(item => item !== size);
    }
    setProductData({ ...productData, sizes: updatedSizes });
  };


  const handelChangeCheckbox = (e) => {
    const { checked } = e.target;
    let updateColors = [...productData.colors];
    if(checked) {
      updateColors.push(e.target.value)
    } else {
      updateColors = updateColors.filter(item => item !== e.target.value);
    }
    setProductData({...productData, colors : updateColors})
  }


  const handleDescriptionChange = description => {
    setProductData({ ...productData, product_desc: description });
  };
  console.log(productData)

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="product_name"
        value={productData.product_name}
        onChange={handleChange}
        placeholder="Product Name"
      />
      <ProductDescriptionEditor onChange={handleDescriptionChange}/>
      <input
        type="number"
        name="product_price"
        value={productData.product_price}
        onChange={handleChange}
        placeholder="Product Price"
      />
      <input
        type="number"
        name="discount"
        value={productData.discount}
        onChange={handleChange}
        placeholder="Discount"
      />
      <input
        type="date"
        name="discount_end_date"
        value={productData.discount_end_date}
        onChange={handleChange}
        placeholder="Discount End Date"
      />
      <input
        type="number"
        name="quantity"
        value={productData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
      />
      <label>
        X
        <input
          type="checkbox"
          checked={productData.sizes.includes(3)}
          onChange={e => handleCheckboxChange(e, 3)}
        />
      </label>
      <label>
        XL
        <input
          type="checkbox"
          checked={productData.sizes.includes(4)}
          onChange={e => handleCheckboxChange(e, 4)}
        />
      </label>
      <label>
        M
        <input
          type="checkbox"
          checked={productData.sizes.includes(5)}
          onChange={e => handleCheckboxChange(e, 5)}
        />
      </label>
      <label>
        L
        <input
          type="checkbox"
          checked={productData.sizes.includes(6)}
          onChange={e => handleCheckboxChange(e, 6)}
        />
      </label>
      <input
        type="file"
        name="image_urls"
        onChange={handleFileChange}
        multiple
      />
      <select value={productData.category} onChange={HandelChangeCategory}>
        {
          categories.map((v, i) => (
            <option key={i} value={v.category_id}>{v.category_name}</option>
          ))
        }
      </select>
        <div>
          <div>Colors</div>
          {
            colors.map((v, i) => (
              <div style={{display: 'flex', alignItems: 'center'}}>
                <input type='checkbox' value={v.color_id} onChange={handelChangeCheckbox}/>
                <div style={{width: '10px', height: '10px', background: `${v.color_value}`, border: '1px solid'}}></div>
                <label>{v.color_name}</label>
              </div>
            ))
          }
        </div>
        
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
