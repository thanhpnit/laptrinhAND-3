const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// --- XỬ LÝ LỖI KHI NẠP FILE SP.JSON ---
let data = {};
try {
    data = require('./sp.json');
    console.log("--- Dữ liệu sp.json đã được nạp ---");
    // console.log(data); // Bỏ comment nếu muốn xem nội dung
} catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
        console.warn("⚠️ CẢNH BÁO: Không tìm thấy file './sp.json'. Bỏ qua.");
    } else {
        console.error("❌ LỖI KHÁC KHI NẠP SP.JSON:", e.message);
    }
}
// --- KẾT THÚC XỬ LÝ LỖI NẠP FILE ---

// --- CẤU HÌNH SWAGGER ---
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
// Tải file swagger.yaml từ thư mục hiện tại
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
// --- KẾT THÚC CẤU HÌNH SWAGGER ---

// --- KHAI BÁO ROUTER (Sử dụng const) ---
const indexRouter = require('./routes/index');
const CatagoryRouter = require('./routes/catagoryRouter');
const ProductRouter = require('./routes/productRouter');
const usersRouter = require('./routes/usersRouter'); 
const uploadRouter = require('./routes/uploadRoutes');
// --- KẾT THÚC KHAI BÁO ROUTER ---

const app = express();
const mongoose = require('mongoose');
require("./models/cart");

// KẾT NỐI MONGODB (Đã tối ưu hóa tùy chọn)
mongoose.connect('mongodb+srv://thanhpn:vclvcl123@cluster0.jpckbbm.mongodb.net/shopdb')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));              

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');                                                                                                      

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// --- TÍCH HỢP SWAGGER UI ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ĐỊNH TUYẾN (ROUTES) ---
app.use('/', indexRouter); 
app.use('/users', usersRouter); 
app.use('/danh-muc', CatagoryRouter); 
app.use('/product', ProductRouter);
app.use('/api', uploadRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;