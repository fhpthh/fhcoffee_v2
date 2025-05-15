import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        console.log('=== Auth Middleware ===');

        // Xử lý token từ headers hoặc từ body (từ form POST)
        let authToken;

        // Lấy token từ header Authorization
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            authToken = authHeader.split(' ')[1];
        }

        // Lấy token từ body form (khi gửi từ form)
        if (!authToken && req.body && req.body.Authorization) {
            const bodyAuth = req.body.Authorization;
            if (bodyAuth.startsWith('Bearer ')) {
                authToken = bodyAuth.split(' ')[1];
            }
        }

        // Nếu không tìm thấy token
        if (!authToken) {
            console.log('Invalid or missing token');
            return res.status(401).json({
                success: false,
                message: "No token provided or invalid format. Please login again"
            });
        }

        console.log('Token received:', authToken);

        const token_decode = jwt.verify(authToken, process.env.JWT_SECRET);
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