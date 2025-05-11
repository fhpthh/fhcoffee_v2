import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItem, setCartItem] = useState({});
    const [token, setToken] = useState(null);
    const url = "http://localhost:4000";

    const [food_list, setFoodList] = useState([]);

    // Kiểm tra token khi component mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            loadCartData(storedToken);
        }

        // Fetch food list data
        fetchFoodList();
    }, []);

    const addToCart = async (itemId) => {
        setCartItem((prev) => {
            const updated = {
                ...prev,
                [itemId]: prev[itemId] ? prev[itemId] + 1 : 1,
            };
            console.log("Cart after add:", updated);
            return updated;
        });
        try {
            const response = await axios.post(
                `${url}/api/cart/add`,
                {
                    itemId,
                    quantity: 1, // Số lượng thêm vào giỏ hàng
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token nếu cần xác thực
                    },
                }
            );

            console.log("API response:", response.data);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItem((prev) => {
            if (!prev[itemId]) return prev;
            const updated = { ...prev, [itemId]: prev[itemId] - 1 };
            if (updated[itemId] <= 0) delete updated[itemId];
            console.log('Cart after remove:', updated);
            return updated;
        });

        try {
            const response = await axios.delete(`${url}/api/cart/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    itemId: itemId,
                    quantity: 1
                }
            });

            console.log('API response:', response.data);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
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
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.get(`${url}/api/cart/get`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token để xác thực
                },
            });
            setCartItem(response.data.cartData); // Cập nhật state cartItem
            console.log("Cart data loaded:", response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    const clearCart = () => {
        setCartItem({});
        // Nếu muốn xóa trên server, có thể gọi API xóa cartData của user ở đây
    };

    const contextValue = {
        food_list,
        cartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmout,
        url,
        token,
        setToken,
        clearCart,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;