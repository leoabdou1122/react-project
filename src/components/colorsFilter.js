const { useState } = require("react");
  
  const SearchInputWithCheckboxFilter = ({items}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectAll, setSelectAll] = useState(true);


    const handleSearchTermChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleCheckboxChange = (event) => {
      const { value, checked } = event.target;
      if (checked) {
        setSelectedFilters([...selectedFilters, value]);
        setSelectAll(false)
      } else {
        setSelectedFilters(selectedFilters.filter((item) => item !== value));
      }
    };
  
    const handelAllCheckbox = (event) => {
        const {checked} = event.target;

        if (checked) {
            setSelectedFilters([event.target.value])
            setSelectAll(true)
        }
    }

    const filterItems = (items) => {
      return items.filter((item) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const lowerItemLabel = item.color_name.toLowerCase();
        return lowerItemLabel.includes(lowerSearchTerm) &&
          (!selectedFilters.length || selectedFilters.includes(item.color_name));
      });
    };
  
    const renderedItems = filterItems(items);
  
    return (
      <div className="color-search-filter">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchTermChange} className="color-search"/>
        <div className="colors">
        <div className="color">
                    <input
                        id="AllColors"
                        type="checkbox"
                        value='All'
                        checked={selectAll}
                        onChange={handelAllCheckbox}
                        className="color-checkbox"
                    />
                    <div className="color-check" ></div>
                    <div className="color-view all-color" ></div>
                    <label htmlFor='AllColors' className="color-name">All</label>
                    </div>
            {
                (searchTerm && renderedItems.length > 0) ? (
                    renderedItems.map((item) => (
                        <div key={item.color_id} className="color">
                        <input
                            type="checkbox"
                            id={item.color_name}
                            value={item.color_name}
                            checked={selectedFilters.includes(item.color_name)}
                            onChange={handleCheckboxChange}
                            className="color-checkbox"
                        />
                        <div className="color-check" ></div>
                        <div className="color-view" style={{backgroundColor : item.color_value}}></div>
                        <label htmlFor={item.color_name} className="color-name">{item.color_name}</label>
                        </div>
                    ))
                )
                : (searchTerm && renderedItems.length === 0) 
                ? <p>Aucun résultat trouvé</p>
                :
                items.map((item) => (
                    <div key={item.color_id} className="color">
                    <input
                        type="checkbox"
                        id={item.color_name}
                        value={item.color_name}
                        checked={selectedFilters.includes(item.color_name)}
                        onChange={handleCheckboxChange}
                        className="color-checkbox"
                    />
                    <div className="color-check" ></div>
                    <div className="color-view" style={{backgroundColor : item.color_value}}></div>
                    <label htmlFor={item.color_name} className="color-name">{item.color_name}</label>
                    </div>
                ))
            }
        </div>
        
        <button className="applied-filter">Applied</button>
      </div>
    );
  };
  
  export default SearchInputWithCheckboxFilter;