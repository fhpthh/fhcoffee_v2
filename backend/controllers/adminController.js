import adminModel from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Register admin
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Kiểm tra email đã tồn tại chưa
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Email đã được sử dụng"
            });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo admin mới
        const newAdmin = new adminModel({
            name,
            email,
            password: hashedPassword
        });

        await newAdmin.save();

        // Tạo token
        const token = jwt.sign(
            { id: newAdmin._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: _pw, ...adminData } = newAdmin.toObject();

        res.status(201).json({
            success: true,
            token,
            admin: adminData,
            message: "Đăng ký thành công"
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// Login admin
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại"
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không đúng"
            });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: _pw, ...adminData } = admin.toObject();

        res.status(200).json({
            success: true,
            token,
            admin: adminData,
            message: "Đăng nhập thành công"
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// Verify admin token
const verifyAdmin = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.admin.id).select('-password');
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy admin"
            });
        }

        res.status(200).json({
            success: true,
            admin
        });
    } catch (error) {
        console.error("Verify error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

export { loginAdmin, verifyAdmin, registerAdmin }; 