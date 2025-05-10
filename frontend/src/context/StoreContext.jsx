import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItem, setCartItem] = useState({});
    const [token, setToken] = useState(null);
    const url = "http://localhost:4000"

    const [food_list, setFoodList] = useState([])

    // Kiểm tra token khi component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }

        // Fetch food list data
        fetchFoodList();
    }, []);

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

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }
    const contextValue = {
        food_list,
        cartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmout,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;