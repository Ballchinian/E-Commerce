import React from 'react';
import './Banner.css';
import basketLogo from './basket_logo.png';
import searchIcon from './search_icon.png';
import { useNavigate } from 'react-router-dom';

function Banner({ setSearchQuery }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // clear JWT token
    navigate('/login'); // redirect to login page
  };

  const handleBasket = () => {
    //To Basket!
    navigate('/basket');
  }

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const email = JSON.parse(localStorage.getItem('email'));
  
  const displayName = email || 'guest';


  return (
    <header>
      <div id="shop_name">
        <h2>E-Commerce Shop</h2>
      </div>
      <div id="delivery_address">
        <p>Delivering to {displayName}</p>
      </div>
      <div id="search_bar">
        <input placeholder="Search e-commerce shop here" onChange={handleSearchInputChange}/>
        <button>
          <img src={searchIcon} alt="confirm search query icon" />
        </button>
      </div>
      <div id="sign_out">
        <button onClick={handleLogout}>
          <p>Sign Out</p>
        </button>
      </div>
      <div id="basket">
        <button onClick={handleBasket}>
          <img src={basketLogo} alt="basket checkout logo" />
        </button>
      </div>
    </header>
  );
}

export default Banner;
