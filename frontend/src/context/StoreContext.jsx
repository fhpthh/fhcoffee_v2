import { createContext, useState } from "react";
import { food_list } from "../assets/assets";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItem, setCartItem] = useState({});

    const addToCart = (itemId) => {
        setCartItem((prev) => {
            const updated = {
                ...prev,
                [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
            };
            console.log('Cart after add:', updated);
            return updated;
        });
    };

    const removeFromCart = (itemId) => {
        setCartItem((prev) => {
            if (!prev[itemId]) return prev;
            const updated = { ...prev, [itemId]: prev[itemId] - 1 };
            if (updated[itemId] <= 0) delete updated[itemId];
            console.log('Cart after remove:', updated);
            return updated;
        });
    };

    const getTotalCartAmout = () => {
        let total = 0;
        for (const itemId in cartItem) {
            if (cartItem[itemId] > 0) {
                let item = food_list.find((item) => item._id === itemId);
                if (item) {
                    total += item.price * cartItem[itemId];
                }
            }
        }
        return total;
    };

    const contextValue = {
        food_list,
        cartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmout,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;