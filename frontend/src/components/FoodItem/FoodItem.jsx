import React, { useContext } from 'react';
import './FoodItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItem, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Cảnh báo nếu id bị undefined
  if (id === undefined) {
    console.warn('FoodItem: id is undefined!', { name, price, description, image });
    return null;
  }

  const handleAdd = () => {
    if (id !== undefined) addToCart(id);
  };
  const handleRemove = () => {
    if (id !== undefined) removeFromCart(id);
  };

  return (
    <div className="food-item">
      {/* Hình ảnh món ăn */}
      <div className="food-item-img-container">
        <img className="food-item-img" src={`${url}/images/${image}`} alt={name} />
        {!cartItem[id] ? (
          <button className="add-btn image-add-btn" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        ) : (
          <span className="food-item-badge">{cartItem[id]}</span>
        )}
      </div>
      {cartItem[id] > 0 && (
        <div className="food-item-counter image-counter">
          <button className="counter-btn" onClick={handleRemove}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="item-count">{cartItem[id]}</span>
          <button className="counter-btn" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      )}

      {/* Thông tin món ăn */}
      <div className="food-item-info">
        <p className="food-item-name">{name}</p>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{price.toLocaleString()}đ</p>
      </div>
    </div>
  );
};

export default FoodItem;