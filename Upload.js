const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Đảm bảo thư mục này đã được tạo thủ công!
        cb(null, './public/images/') 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

module.exports = multer({ storage: storage });