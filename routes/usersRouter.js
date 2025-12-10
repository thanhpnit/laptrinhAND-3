const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Giả định mô hình User.js nằm trong models/

// Middleware để xử lý lỗi bất đồng bộ
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 1. GET: Lấy tất cả người dùng (READ All)
// GET /api/users
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find().select('-password'); // Không trả về mật khẩu
    res.status(200).json(users);
}));

// 2. POST: Tạo người dùng mới (CREATE)
// POST /api/users
router.post('/', asyncHandler(async (req, res) => {
    // Lưu ý: Trong ứng dụng thực tế, cần hash mật khẩu (dùng bcryptjs) trước khi lưu
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({ 
        message: "User created successfully", 
        user: savedUser.toObject({ getters: true, virtuals: false, versionKey: false }) 
    });
}));

// 3. GET: Lấy người dùng theo ID (READ One)
// GET /api/users/:id
router.get('/:id', asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
}));

// 4. PUT: Cập nhật người dùng theo ID (UPDATE - Toàn bộ)
// PUT /api/users/:id
router.put('/:id', asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true } // Trả về tài liệu mới và kiểm tra ràng buộc
    ).select('-password');

    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found for update' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
}));

// 5. DELETE: Xóa người dùng theo ID (DELETE)
// DELETE /api/users/:id
router.delete('/:id', asyncHandler(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found for deletion' });
    }
    // Trả về mã 204 No Content
    res.status(204).send(); 
}));

module.exports = router;