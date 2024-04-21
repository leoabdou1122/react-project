import React, { useEffect, useState } from 'react';

function PriceFilter({setPrice, min, max}) {
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  const handleMaxPriceChange = (e) => {
    const value = e.target.value.trim(); // Remove leading and trailing spaces
    setMaxPrice(value === '' ? Infinity : parseFloat(value)); // Set maxPrice to Infinity if value is empty
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value.trim(); // Remove leading and trailing spaces
    setMinPrice(value === '' ? 0 : parseFloat(value)); // Set maxPrice to Infinity if value is empty
  };

  const handelPrice = () => {
    setPrice(minPrice, maxPrice)
  }

  useEffect(() => {
    setMinPrice(min)
    setMaxPrice(max)
  }, [min, max])
  return (
    <div className="price-filter">
      <div className='price-input'>
        <input
            placeholder='10 MAD'
            type="number"
            onChange={handleMinPriceChange}
        />
        -
        <input
            placeholder='100 MAD'
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
        />
      </div>
      <button className="applied-filter" onClick={() => handelPrice()}>Applied</button>
    </div>
  );
}

export default PriceFilter;
