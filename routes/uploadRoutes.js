
const express = require('express');
const router = express.Router();

// 🚨 Gọi các module nằm ở thư mục gốc
const upload = require('../Upload'); 
const sendMail = require('../Mailer'); 

// --- A. UPLOAD FILE ĐƠN LẺ ---
router.post('/upload', [upload.single('hinhAnh')], async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) {
           return res.json({ status: 0, link : "" }); 
        } else {
            // Thay đổi cổng nếu bạn đã chuyển sang 3001
            const url = `http://localhost:3000/images/${file.filename}`; 
            return res.json({ status: 1, url : url });
        }
    } catch (error) {
        console.log('Upload image error: ', error);
        return res.json({status: 0, link : "" });
    }
});

// --- B. UPLOAD NHIỀU FILE ---
router.post('/uploads', [upload.array('image', 9)], async (req, res, next) => {
    try {
        const { files } = req;
        if (!files || files.length === 0) {
           return res.json({ status: 0, link : [] }); 
        } else {
          const url = [];
          for (const singleFile of files) {
            const fileUrl = `http://localhost:3000/images/${singleFile.filename}`;
            url.push(fileUrl);
          }
            return res.json({ status: 1, url : url });
        }
    } catch (error) {
        console.log('Upload image error: ', error);
        return res.json({status: 0, link : [] });
    }
});

// --- C. GỬI MAIL ---
router.post("/send-mail", async function(req, res, next){
    try{
        const {to, subject, content} = req.body;
        const mailOptions = {
            from: "nguoiyeucuaem <thanhpnvpbq@gmail.com>",
            to: to,
            subject: subject,
            html: content
        };
        await sendMail.transporter.sendMail(mailOptions);
        res.json({ status: 1, message: "Gửi mail thành công"});
    }catch(err){
        console.error('Send mail error:', err);
        res.json({ status: 0, message: "Gửi mail thất bại"});
    }
});

module.exports = router;