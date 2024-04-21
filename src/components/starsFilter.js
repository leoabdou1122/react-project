import { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { Rating } from "react-simple-star-rating";

const StarsFilter = ({setStars, rating}) => {
    const [selectedFilter, setSelectedFilter] = useState();

    const handelChangeRadio = (event) => {
        const {value, checked} = event.target;

        if (checked) {
            setSelectedFilter(value)
            setStars(value)
        }
        
    }

    useEffect(() => {
        setSelectedFilter(rating)
    }, [rating])
    return (
      <div className="stars-filter">
        <div className="stars">
            <div className="star-input">
                <input type="radio" id="all" name="stars" value={0} checked={selectedFilter == 0} onChange={handelChangeRadio}/>
                <div className="star-check" onClick={() => setSelectedFilter(0)}></div>
                <label for="all">All</label>
           </div>
           <div className="star-input">
                <input type="radio" id="fiveStars" name="stars" value={5} checked={selectedFilter == 5} onChange={handelChangeRadio}/>
                <div className="star-check" onClick={() => setSelectedFilter(5)}></div>
                <label for="fiveStars">
                    <Rating fillColor='#ff7675'  initialValue={5} fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
                    & Up
                </label>
           </div>
           <div className="star-input">
                <input type="radio" id="fourStars" name="stars" value={4} checked={selectedFilter == 4} onChange={handelChangeRadio}/>
                <div className="star-check" onClick={() => setSelectedFilter(4)}></div>
                <label for="fourStars">
                    <Rating fillColor='#ff7675'  initialValue={4} fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
                    & Up
                </label>
           </div>
           <div className="star-input">
                <input type="radio" id="threeStars" name="stars" value={3} checked={selectedFilter == 3} onChange={handelChangeRadio}/>
                <div className="star-check" onClick={() => setSelectedFilter(3)}></div>
                <label for="threeStars">
                    <Rating fillColor='#ff7675'  initialValue={3} fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
                    & Up
                </label>
           </div>
           <div className="star-input">
                <input type="radio" id="twoStars" name="stars" value={2} checked={selectedFilter == 2} onChange={handelChangeRadio}/>
                <div className="star-check" onClick={() => setSelectedFilter(2)}></div>
                <label for="twoStars">
                    <Rating fillColor='#ff7675'  initialValue={2} fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
                    & Up
                </label>
           </div>
           <div className="star-input">
                <input type="radio" id="oneStar" name="stars" value={1} checked={selectedFilter == 1} onChange={handelChangeRadio}/>
                <div className="star-check" onClick={() => setSelectedFilter(1)}></div>
                <label for="oneStar">
                    <Rating fillColor='#ff7675'  initialValue={1} fillIcon={<BsStarFill size={15}/>} emptyIcon={<BsStar size={15}/>} readonly/>
                    & Up
                </label>
           </div>
        </div>
      </div>
    );
  };
  
  export default StarsFilter;