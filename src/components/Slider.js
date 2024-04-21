import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
function Slider() {


  const [sliderImg, setSliderImg] = useState([])
  useEffect(() => {
    axios.get('http://localhost:3002/slider')
    .then(res => setSliderImg(res.data))
  }, [])

  console.log(sliderImg)
  return (
    <motion.div id='slider' initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}>
        <Swiper
          cssMode={true}
          navigation={true}
          pagination={true}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          className="slider"
        >
          {
            sliderImg.map((v, i) => (
              <SwiperSlide style={{backgroundImage: `url("/uploads/slider-images/${v.image_url}")`, backgroundSize: 'cover'}}></SwiperSlide>
            ))
          }
      </Swiper>
    </motion.div>
          
      
      
  );
}

export default Slider;