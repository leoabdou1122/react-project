import React, { useEffect, useState } from 'react'
import Slider from '../components/Slider';
import Categories from '../components/Categories';
import DiscoverNew from '../components/DiscoverNew';
import BestDeals from '../components/BestDeals';
import PicksForYou from '../components/PicksForYou';
import SyncLoader from 'react-spinners/SyncLoader'
import { motion } from 'framer-motion';

function Home() {
  const [isLoading, setIsLoading] = useState(!sessionStorage.getItem('seenLoadingAnimation'));

 useEffect(() => {
    const hasSeenAnimation = sessionStorage.getItem('seenLoadingAnimation');
    if (hasSeenAnimation) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000)
    } else {
      sessionStorage.setItem('seenLoadingAnimation', true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000)// Set to false after storing the flag
    }
  }, []);

  return (
    <>
      {isLoading 
      ? 
      <LoadingAnimation/>
    :
      <div className='home-page'>
          <Slider/>
          <Categories/>
          <BestDeals/>
          <DiscoverNew/>
          <PicksForYou/>
        </div>
        }
    </>
    
    
  )
}

function LoadingAnimation() {
  // Add your loading animation component here
  return (
    <motion.div className="loading-animation" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{delay: 2, transition : 0.7 }}>
      <SyncLoader color="#ff7675"/>
    </motion.div>
  );
}

export default Home;