import { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { Rating } from "react-simple-star-rating";

function SizesFilter({items}) {
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [selectAll, setSelectAll] = useState(true);


    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
          setSelectedFilter([...selectedFilter, value]);
          setSelectAll(false)
        } else {
          setSelectedFilter(selectedFilter.filter((item) => item !== value));
        }
      };

      const handelAllCheckbox = (event) => {
        const {checked} = event.target;

        if (checked) {
            setSelectedFilter([event.target.value])
            setSelectAll(true)
        }
    }

    const checkAll = () => {
        setSelectedFilter(['All']) 
        setSelectAll(true)
    }

    const checkSize = (sizeName) => {
        if (selectedFilter.includes(sizeName)) {
            setSelectedFilter(selectedFilter.filter((item) => item !== sizeName));
        } else {
            setSelectedFilter([...selectedFilter, sizeName]);
            setSelectAll(false)
        }
    }
    return (
      <div className="sizes-filter">
        <div className="sizes">
            <div className="size-input">
                <input type="checkbox" id="Allsizes" value='All' checked={selectAll} onChange={handelAllCheckbox}/>
                <div className="size-check" onClick={() => checkAll()}></div>
                <label htmlFor='Allsizes' >All</label>
           </div>
           {
            items.map((item, index) => (
                <div className="size-input">
                    <input type="checkbox" id={item.size_id} value={item.size_name} checked={selectedFilter.includes(item.size_name)} onChange={handleCheckboxChange}/>
                    <div className="size-check" onClick = {() => checkSize(item.size_name)}></div>
                    <label for={item.size_id} htmlFor={item.size_id}>{item.size_name}</label>
                </div>
            ))
           }
        </div>

        <button className="applied-filter">Applied</button>
      </div>
    );
}

export default SizesFilter;