import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem.jsx';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2 className="section-title">Mời bạn thưởng thức</h2>
      <div className="food-display-list">
        {food_list
          .filter(item => category === "All" || item.category === category)
          .map(item => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
