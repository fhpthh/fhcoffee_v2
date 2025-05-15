import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        console.log('=== Auth Middleware ===');
        console.log('Headers:', req.headers);
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Invalid or missing token');
            return res.status(401).json({
                success: false,
                message: "No token provided or invalid format. Please login again"
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token received:', token);

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', token_decode);

        // Add user info to request
        req.user = {
            _id: token_decode.id
        };
        console.log('User ID from token:', req.user._id);
        console.log('=== End Auth Middleware ===');

        next();
    } catch (error) {
        console.log('Auth Error:', error);
        return res.status(401).json({
            success: false,
            message: "Invalid token. Please login again"
        });
    }
}

export default authMiddleware;