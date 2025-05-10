import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login

const loginUser = async (req, res) => {
    console.log("Login attempt with body:", req.body);
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
        }
        console.log("Finding user with email:", email);
        const user = await userModel.findOne({ email })
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ success: false, message: "Tài khoản không tồn tại" })
        }
        console.log("Comparing passwords");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(401).json({ success: false, message: "Thông tin đăng nhập không hợp lệ" })
        }

        const token = createToken(user._id);
        console.log("Generated token:", token);
        console.log("Token length:", token.length);

        // Trả về thông tin user (trừ password)
        const { password: _pw, ...userData } = user.toObject();
        console.log("Login successful for user:", email);
        console.log("User data:", userData);

        res.status(200).json({
            success: true,
            token,
            user: userData,
            message: "Đăng nhập thành công"
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

//register
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key')
}
const registerUser = async (req, res) => {
    console.log("Register attempt with body:", req.body);
    const { name, password, email } = req.body;
    try {
        if (!name || !email || !password) {
            console.log("Missing required fields");
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        if (typeof name !== 'string' || name.trim().length < 2) {
            console.log("Invalid name");
            return res.status(400).json({ success: false, message: 'Tên không hợp lệ (tối thiểu 2 ký tự)' });
        }
        console.log("Checking if user exists");
        const exists = await userModel.findOne({ email })
        if (exists) {
            console.log("User already exists");
            return res.status(409).json({ success: false, message: 'Tài khoản đã tồn tại' })
        }
        if (!validator.isEmail(email)) {
            console.log("Invalid email format");
            return res.status(400).json({ success: false, message: 'Vui lòng sử dụng email hợp lệ' })
        }
        if (password.length < 8) {
            console.log("Password too short");
            return res.status(400).json({ success: false, message: 'Vui lòng sử dụng mật khẩu mạnh hơn (tối thiểu 8 ký tự)' })
        }

        console.log("Hashing password");
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name.trim(),
            email: email,
            password: hashedPassword
        })
        console.log("Saving new user");
        const user = await newUser.save()
        const token = createToken(user._id)
        // Trả về thông tin user (trừ password)
        const { password: _pw, ...userData } = user.toObject();
        console.log("Registration successful for:", email);
        res.status(201).json({ success: true, token, user: userData })
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

export { loginUser, registerUser }