const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const category = require('../models/category');

// Thêm danh mục
router.post('/add', async (req, res) => {
    try {
        const { CataName, description, parentID } = req.body;

        if (!CataName) {
            return res.status(400).json({ error: "CataName is required" });
        }

        const newCat = new Category({
            CataName,
            description,
            parentID: parentID || null
        });

        await newCat.save();
        
        res.json({ message: "Category created", data: newCat });

    } catch (err) {
        res.status(200).json({ error: err.message });
    }
});

router.put("/update", async function(req,res){
    const {id, CataName, parentID} = req.body;

    //tìm kiếm
    const item = await category.findById(id);
    if(item){
        //cập nhật
        item.CataName = CataName ? CataName : item.CataName;
        item.parentID = parentID ? parentID : item.parentID;
        await item.save();
        res.status(200).json({status: true, message:"Thành công"})
    }else{
        res.status(200).json({"status":false, message:"Không tìm thấy"});
    }
});

//localhost:3000/danh-muc/delete?id=abc&name=def&price=1000
//localhost:3000/danh_muc/delete/abc/def
router.delete("/delete", async function(req,res){
    const {id} = req.query;
    const item = await category.findById(id);
    if(item){
        await category.findByIdAndDelete(id);
          res.status(200).json({status: true, message:"Thành công"})
    }else{
        res.status(200).json({"status":false, message:"Không tìm thấy"});
    }
})

module.exports = router;
