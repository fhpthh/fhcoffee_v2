import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        console.log('=== Add to Cart Request ===');
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);

        const userId = req.user._id;
        const itemId = req.body.itemId;

        // console.log('User ID from token:', userId);
        // console.log('Item ID from request:', itemId);

        console.log(1)

        if (!itemId) {
            console.log('Missing itemId in request');
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }

        console.log(itemId);

        const userData = await userModel.findOne({ _id: userId });
        console.log('User data found:', userData ? 'Yes' : 'No');
        console.log(userData);

        if (!userData) {
            console.log('User not found:', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = userData.cartData || {};
        console.log('Current cart data:', cartData);

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        console.log('Updated cart data:', cartData);

        await userModel.findByIdAndUpdate(
            userId,
            { cartData: cartData }
        );

        console.log('Cart updated successfully');
        return res.status(200).json({
            success: true,
            message: "Added to Cart",
            cartData: cartData
        });
    } catch (error) {
        console.log('Error in addToCart:', error);
        return res.status(500).json({
            success: false,
            message: "Error adding to cart"
        });
    }
}

// remove items from user cart 
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { itemId, quantity } = req.query; // Lấy dữ liệu từ query string

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }

        const userData = await userModel.findOne({ _id: userId });
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = userData.cartData || {};
        if (cartData[itemId]) {
            if (cartData[itemId] > 1) {
                cartData[itemId] -= 1; // Giảm số lượng sản phẩm
            } else {
                delete cartData[itemId]; // Xóa sản phẩm nếu số lượng <= 0
            }
        }

        await userModel.findByIdAndUpdate(
            userId,
            { cartData: cartData }
        );

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cartData: cartData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error removing from cart"
        });
    }
};

// fetch user cart data
const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const userData = await userModel.findOne({ _id: userId });
        console.log(userData);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const cartData = userData.cartData;
        return res.status(200).json({
            success: true,
            cartData: cartData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching cart"
        });
    }
}

const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        return res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error clearing cart" });
    }
};

export { addToCart, removeFromCart, getCart, clearCart }