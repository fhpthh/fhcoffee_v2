import userModel from "../models/userModel";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

//login

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(401).json({ success: false, message: "Tài khoản không tồn tại" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Thông tin đăng nhập không hợp lệ" })
        }

        const token = createToken(user._id);
        // Trả về thông tin user (trừ password)
        const { password: _pw, ...userData } = user.toObject();
        res.status(200).json({ success: true, token, user: userData })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

//register
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        if (typeof name !== 'string' || name.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Tên không hợp lệ (tối thiểu 2 ký tự)' });
        }
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(409).json({ success: false, message: 'Tài khoản đã tồn tại' })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Vui lòng sử dụng email hợp lệ' })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Vui lòng sử dụng mật khẩu mạnh hơn (tối thiểu 8 ký tự)' })
        }

        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name.trim(),
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        // Trả về thông tin user (trừ password)
        const { password: _pw, ...userData } = user.toObject();
        res.status(201).json({ success: true, token, user: userData })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Lỗi server" })
    }
}

export { loginUser, registerUser }