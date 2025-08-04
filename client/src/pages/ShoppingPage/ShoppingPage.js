import './ShoppingPage.css';
import React, { useState } from 'react';
import Banner from '../../components/ShoppingPage/Banner/Banner';
import PriceSlider from '../../components/ShoppingPage/Search_criteria/PriceSlider';
import Filter from "../../components/ShoppingPage/Search_criteria/Filter";
import ItemListings from '../../components/ShoppingPage/Item_listings/Item_listings';
import 'bootstrap/dist/css/bootstrap.min.css';



function ShoppingPage() {
  //searchQuery is from the search bar
  //PriceRange is from the price range bar
  //sortType is from the filter button
  //All of these are declared here to help communicate between modules
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 999]);
  //'Filter' is the default button name
  const [sortType, setSortType] = useState('Filter');

  return (
    <div className="App">
      <Banner setSearchQuery={setSearchQuery} />
      <div id="filter">
        <Filter setSortType={setSortType} sortType={sortType}/>
      </div>
      <div id="price_slider">
        <PriceSlider setPriceRange={setPriceRange} />
      </div>

      <div className = "display">
        <ItemListings searchQuery={searchQuery} priceRange={priceRange} sortType={sortType}/>
      </div>
    </div>
  );
}

export default ShoppingPage;
