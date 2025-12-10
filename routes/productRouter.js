const express = require('express');
const router = express.Router();
const productModel = require('../models/Product'); // Đảm bảo đúng tên mô hình (Product.js)




// Middleware để xử lý lỗi bất đồng bộ (giống trong OrderRoutes.js)
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 1. Lấy danh sách sản phẩm với những thuộc tính được yêu cầu (GET /all)
// Endpoint: /product/all
router.get("/all", asyncHandler(async (req, res) => {
    // Chỉ lấy các thuộc tính: name, description, price, quantity, cateID
    const list = await productModel.find({}, "name description price quantity cateID").populate('cateID', 'name');
    res.status(200).json({ status: true, message: "Thành công", data: list });
}));

// 2. Thêm mới sản phẩm (POST /add)
// Endpoint: /product/add
router.post("/add", asyncHandler(async (req, res) => {
    // Không cần tạo thủ công createdAt/updateAt vì Mongoose có timestamps: true
    const newProduct = new productModel(req.body);
    await newProduct.save();

    res.status(201).json({ status: true, message: "Thêm sản phẩm thành công", data: newProduct });
}));

// 3. Cập nhật sản phẩm theo ID (PUT /update)
// Endpoint: /product/update (Giả định ID được truyền qua body)
router.put("/update", asyncHandler(async (req, res) => {
    const { id, name, description, price, quantity, status, cateID } = req.body;

    // Tìm và cập nhật sản phẩm
    const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        { 
            name, 
            description, 
            price, 
            quantity, 
            status, 
            cateID,
            // updateAt được tự động cập nhật nhờ timestamps: true
        },
        { new: true, runValidators: true }
    );

    if (updatedProduct) {
        res.status(200).json({ status: true, message: "Cập nhật thành công", data: updatedProduct });
    } else {
        res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm để cập nhật." });
    }
}));


// 4. Xóa sản phẩm theo ID (DELETE /delete?id=...)
// Endpoint: /product/delete?id=... (Lấy ID từ Query Parameter)
router.delete("/delete", asyncHandler(async (req, res) => {
    // Lấy ID từ Query Parameter: req.query.id
    const id = req.query.id; 

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (deletedProduct) {
        // Trả về mã 204 No Content hoặc 200 OK
        res.status(200).json({ status: true, message: "Xóa thành công" });
    } else {
        res.status(404).json({ status: false, message: "Không tìm thấy sản phẩm để xóa." });
    }
}));


// =================================================================
//                   CÁC API TÌM KIẾM/LỌC (LAB 4/YÊU CẦU BỔ SUNG)
// =================================================================

// 5. Lấy danh sách tất cả sp có giá > 100,000
// Endpoint: /product/search/price-gt-100k
router.get("/search/price-gt-100k", asyncHandler(async (req, res) => {
    const list = await productModel.find({ price: { $gt: 100000 } });
    res.status(200).json({ status: true, message: "Thành công: Giá > 100k", data: list });
}));

// 6. Lấy danh sách tất cả sp có giá từ 100,000 đến 200,000
// Endpoint: /product/search/price-range-100k-200k
router.get("/search/price-range-100k-200k", asyncHandler(async (req, res) => {
    // Sửa lỗi cú pháp: $gte và $lte
    const list = await productModel.find({ price: { $gte: 100000, $lte: 200000 } }); 
    res.status(200).json({ status: true, message: "Thành công: Giá 100k - 200k", data: list });
}));

// 7. Lấy danh sách tất cả sp có giá từ 100,000 VÀ có số lượng > 10
// Endpoint: /product/search/price-100k-and-qty-gt-10
router.get("/search/price-100k-and-qty-gt-10", asyncHandler(async (req, res) => {
    // Sửa lỗi cú pháp: dùng 'quantity' thay vì 'stock'
    const list = await productModel.find({ $and: [{ price: { $gte: 100000 } }, { quantity: { $gt: 10 } }] });
    res.status(200).json({ status: true, message: "Thành công: Giá >= 100k và Số lượng > 10", data: list });
}));

// 8. Lọc danh sách sp có giá lớn hơn 50,000. (all-1)
// Endpoint: /product/search/gt-50k
router.get("/search/gt-50k", asyncHandler(async (req, res) => {
    const list = await productModel.find({ price: { $gt: 50000 } });
    res.status(200).json({ status: true, message: "Thành công: Giá > 50k", data: list });
}));

// 9. Lọc danh sách sản phẩm có số lượng nhỏ hơn 10. (all-2)
// Endpoint: /product/search/qty-lt-10
router.get("/search/qty-lt-10", asyncHandler(async (req, res) => {
    const list = await productModel.find({ quantity: { $lt: 10 } });
    res.status(200).json({ status: true, message: "Thành công: Số lượng < 10", data: list });
}));

// 10. Tìm sản phẩm có name chứa từ khóa “socola”. (all-3)
// Endpoint: /product/search/name-socola
router.get("/search/name-socola", asyncHandler(async (req, res) => {
    const keyword = "socola";
    const list = await productModel.find({
        name: { $regex: keyword, $options: "i" } // 'i' là case-insensitive
    })
    res.status(200).json({ status: true, message: "Thành công: Tên chứa 'socola'", data: list });
}));

// 11. Sắp xếp sản phẩm theo giá tăng dần. (all-4)
// Endpoint: /product/sort/price-asc
router.get("/sort/price-asc", asyncHandler(async (req, res) => {
    const list = await productModel.find().sort({ price: 1 });
    res.status(200).json({ status: true, message: "Thành công: Sắp xếp giá tăng dần", data: list });
}));

// 12. Lấy 3 sản phẩm có giá cao nhất. (all-5)
// Endpoint: /product/top/price-3
router.get("/top/price-3", asyncHandler(async (req, res) => {
    const list = await productModel.find().sort({ price: -1 }).limit(3);
    res.status(200).json({ status: true, message: "Thành công: Top 3 giá cao nhất", data: list });
}));

// 13. Lấy 5 sản phẩm có số lượng nhiều nhất. (all-6)
// Endpoint: /product/top/qty-5
router.get("/top/qty-5", asyncHandler(async (req, res) => {
    const list = await productModel.find().sort({ quantity: -1 }).limit(5);
    res.status(200).json({ status: true, message: "Thành công: Top 5 số lượng nhiều nhất", data: list });
}));

// 14. Lấy danh sách sản phẩm được tạo trong ngày hôm nay (all-7)
// Endpoint: /product/search/created-today
router.get("/search/created-today", asyncHandler(async (req, res) => {
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const startTomorrow = new Date(startToday);
    startTomorrow.setDate(startToday.getDate() + 1);
    
    const list = await productModel.find({
        createdAt: { $gte: startToday, $lt: startTomorrow }
    }).sort({ createdAt: -1 });
    res.status(200).json({ status: true, message: "Thành công: Sản phẩm tạo trong ngày hôm nay", data: list });
}));

// 15. Lọc sản phẩm có giá nằm trong khoảng từ 20,000 đến 100,000. (all-8)
// Endpoint: /product/search/price-range-20k-100k
router.get("/search/price-range-20k-100k", asyncHandler(async (req, res) => {
    // Sửa lỗi cú pháp: $gte và $lte
    const list = await productModel.find({ price: { $gte: 20000, $lte: 100000 } }); 
    res.status(200).json({ status: true, message: "Thành công: Giá 20k - 100k", data: list });
}));

// 16. Lấy danh sách sản phẩm có tên bắt đầu bằng chữ “Bánh”. (all-9)
// Endpoint: /product/search/name-start-banh
router.get("/search/name-start-banh", asyncHandler(async (req, res) => {
    const keyword = "^Bánh"; // Dùng ^ để chỉ định bắt đầu chuỗi
    const list = await productModel.find({
        name: { $regex: keyword, $options: "i" }
    })
    res.status(200).json({ status: true, message: "Thành công: Tên bắt đầu bằng 'Bánh'", data: list });
}));

// 17. Tìm sản phẩm theo nhiều điều kiện: giá < 10,000 và quantity > 20. (all-10)
// Endpoint: /product/search/price-lt-10k-and-qty-gt-20
router.get("/search/price-lt-10k-and-qty-gt-20", asyncHandler(async (req, res) => {
    // Sửa lỗi cú pháp: dùng 'quantity' thay vì 'stock'
    const list = await productModel.find({ $and: [{ price: { $lt: 10000 } }, { quantity: { $gt: 20 } }] });
    res.status(200).json({ status: true, message: "Thành công: Giá < 10k và Số lượng > 20", data: list });
}));

// 18. Lấy danh sách sản phẩm có giá < 100,000 và status = true, sắp xếp theo giá giảm dần. (all-11)
// Endpoint: /product/search/price-lt-100k-active-sort-desc
router.get("/search/price-lt-100k-active-sort-desc", asyncHandler(async (req, res) => {
    const list = await productModel.find({
        price: { $lt: 100000 },
        status: true 
    }).sort({ price: -1 });
    res.status(200).json({ status: true, message: "Thành công: Giá < 100k, Active, Sort giảm dần", data: list });
}));

// 19. Lấy sản phẩm có quantity nằm trong khoảng từ 10 đến 30 và name chứa từ “bánh”. (all-12)
// Endpoint: /product/search/qty-range-and-name-banh
router.get("/search/qty-range-and-name-banh", asyncHandler(async (req, res) => {
    const keyword = "Bánh";
    const list = await productModel.find({
        quantity: { $gte: 10, $lte: 30 },
        name: { $regex: keyword, $options: "i" }
    });
    res.status(200).json({ status: true, message: "Thành công: Số lượng 10-30 và Tên chứa 'Bánh'", data: list });
}));

// 20. Tìm sản phẩm theo nhiều điều kiện: name chứa “kem” hoặc “socola”, và giá > 200,000. (all-13)
// Endpoint: /product/search/name-kem-or-socola-price-gt-200k
router.get("/search/name-kem-or-socola-price-gt-200k", asyncHandler(async (req, res) => {
    const list = await productModel.find({
        price: { $gt: 200000 },
        $or: [ // Sử dụng $or cho điều kiện "hoặc"
            { name: { $regex: /kem/i } },
            { name: { $regex: /socola/i } }
        ]
    });
    res.status(200).json({ status: true, message: "Thành công: Tên chứa 'kem'/'socola' và Giá > 200k", data: list });
}));

// 21. Lấy danh sách sản phẩm có quantity > 20, sort quantity giảm dần, sau đó price tăng dần. (all-14)
// Endpoint: /product/search/qty-gt-20-sort
router.get("/search/qty-gt-20-sort", asyncHandler(async (req, res) => {
    // Sửa lỗi cú pháp: dùng $gt thay vì $lt
    const list = await productModel.find({
        quantity: { $gt: 20 }
    }).sort({ quantity: -1, price: 1 });
    res.status(200).json({ status: true, message: "Thành công: Số lượng > 20, Sort Qty giảm/Price tăng", data: list });
}));

// 22. Lấy danh sách sản phẩm theo cateID nhưng loại bỏ các sản phẩm có status = false. (all-15)
// Endpoint: /product/search/by-cateid/:cateID/active
router.get("/search/by-cateid/:cateID/active", asyncHandler(async (req, res) => {
    // Lấy cateID từ req.params
    const list = await productModel.find({
        cateID: req.params.cateID,
        status: true
    });
    res.status(200).json({ status: true, message: "Thành công: Theo Category ID và Active", data: list });
}));

// 23. Tìm sản phẩm có price thấp nhất trong toàn bộ danh sách. (all-16)
// Endpoint: /product/top/price-min
router.get("/top/price-min", asyncHandler(async (req, res) => {
    const list = await productModel.find().sort({ price: 1 }).limit(1);
    res.status(200).json({ status: true, message: "Thành công: Sản phẩm giá thấp nhất", data: list });
}));

// 24. Tìm 5 sản phẩm có price cao nhất nhưng quantity phải lớn hơn 10. (all-17)
// Endpoint: /product/top/price-5-qty-gt-10
router.get("/top/price-5-qty-gt-10", asyncHandler(async (req, res) => {
    const list = await productModel.find({
        quantity: { $gt: 10 }
    }).sort({ price: -1 }).limit(5);
    res.status(200).json({ status: true, message: "Thành công: Top 5 giá cao (Qty > 10)", data: list });
}));

// 25. Tìm tất cả sản phẩm name bắt đầu bằng “Bánh” và description chứa “vani”. (all-18)
// Endpoint: /product/search/name-start-banh-and-desc-vani
router.get("/search/name-start-banh-and-desc-vani", asyncHandler(async (req, res) => {
    const list = await productModel.find({
        name: { $regex: /^Bánh/i }, // Bắt đầu bằng Bánh
        description: { $regex: /vani/i } // Chứa vani
    })
    res.status(200).json({ status: true, message: "Thành công: Tên bắt đầu 'Bánh' và Mô tả chứa 'vani'", data: list });
}));

// 26. Lọc sản phẩm tạo trong vòng 7 ngày trở lại đây dựa vào createdAt. (all-19)
// Endpoint: /product/search/created-last-7-days
router.get("/search/created-last-7-days", asyncHandler(async (req, res) => {
    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 7);
    const list = await productModel.find({
        createdAt: { $gte: last7days } // $gte: Lớn hơn hoặc bằng 7 ngày trước (trong vòng 7 ngày)
    }).sort({ createdAt: -1 })
    res.status(200).json({ status: true, message: "Thành công: Sản phẩm tạo trong 7 ngày gần đây", data: list });
}));

// 27. Lấy sản phẩm theo cateID, và chỉ trả về field: name, price, quantity. (all-20)
// Endpoint: /product/by-cateid/:cateID/fields
router.get("/by-cateid/:cateID/fields", asyncHandler(async (req, res) => {
    const list = await productModel.find({
        cateID: req.params.cateID
    }, "name price quantity"); // Sửa lỗi cú pháp: 'quantily' -> 'quantity'
    res.status(200).json({ status: true, message: "Thành công: Theo Category ID (Chỉ lấy Name, Price, Qty)", data: list });
}));

// 28. Tìm sản phẩm price từ 20,000 đến 200,000 và name KHÔNG chứa “socola”. (all-21)
// Endpoint: /product/search/price-range-no-socola
router.get("/search/price-range-no-socola", asyncHandler(async (req, res) => {
    const list = await productModel.find({
        price: { $gte: 20000, $lte: 200000 },
        name: { $not: /socola/i } // $not kết hợp với $regex
    });
    res.status(200).json({ status: true, message: "Thành công: Giá 20k-200k và Tên KHÔNG chứa 'socola'", data: list });
}));

module.exports = router;