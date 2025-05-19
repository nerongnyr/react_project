const express = require('express');
const db = require('../db');
const authMiddleware  = require('../auth');
const router = express.Router();
const multer  = require('multer')

// router.get("/", async (req, res) => {
//     let {pageSize, offset} = req.query;
//     try{
//         let sql = "SELECT * FROM TBL_PRODUCT LIMIT ? OFFSET ?";
//         let [list] = await db.query(sql, [parseInt(pageSize), parseInt(offset)]);
//         let [count] = await db.query("SELECT COUNT(*) AS cnt FROM TBL_PRODUCT");
//         res.json({
//             message : "result",
//             list : list,
//             count : count[0].cnt
//         });
//     }catch(err){
//         console.log("에러 발생!");
//         res.status(500).send("Server Error");
//     }
// })

router.get("/", async (req, res) => {
    try{
        let sql = "SELECT * FROM TBL_PRODUCT";
        let [list] = await db.query(sql, []);
        let [count] = await db.query("SELECT COUNT(*) AS cnt FROM TBL_PRODUCT");
        res.json({
            message : "result",
            list : list,
            count : count[0].cnt
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.get("/:productId", async (req, res) => {
    let { productId } = req.params;
    try{
        let [list] = await db.query("SELECT * FROM TBL_PRODUCT WHERE PRODUCTID = " + productId);
        let [fileRows] = await db.query("SELECT * FROM TBL_PRODUCT_FILE WHERE PRODUCTID = ?", [productId]);
        console.log(list);
        res.json({
            message : "result",
            info : list[0],
            image: fileRows[0] || null,
            productId: productId 
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        const uniqueName = Date.now() + '_' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

router.post("/", upload.single('image'), async (req, res) => {
    let { productName, description, price, stock, category } = req.body;
    let file = req.file;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
        // 1. 제품 등록
        let query = "INSERT INTO TBL_PRODUCT VALUES(NULL, ?, ?, ?, ?, ?, 'Y', NOW(), NOW())";
        let [result] = await conn.query(query, [productName, description, price, stock, category]);
        let productId = result.insertId;

        // 2. 파일 정보 등록
        if (file) {
            let filePath = '/uploads/' + file.filename;
            let fileName = file.originalname;
            let fileQuery = "INSERT INTO TBL_PRODUCT_FILE VALUES(NULL, ?, ?, ?)";
            await conn.query(fileQuery, [productId, fileName, filePath]);
        }

        await conn.commit();
        res.json({ message: "success" });

    } catch(err) {
        await conn.rollback();
        console.log("에러 발생!", err);
        res.status(500).send("Server Error");
    } finally {
        conn.release();
    }
});


router.delete("/:productId", authMiddleware, async (req, res) => {
    let { productId } = req.params;
    try{
        let result = await db.query("DELETE FROM TBL_PRODUCT WHERE PRODUCTID = ?", [productId]);
        console.log("result ==> ", result);
        res.json({
            message : "success",
            result : result
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.put("/:productId", async (req, res) => {
    let { productId } = req.params;
    let {productName, description, price, stock, category} = req.body;
    try{
        let query = "UPDATE TBL_PRODUCT SET "
                    + "productName=?, description=?, price=?, stock=?, category=? "
                    + "WHERE productId = ?";
        let result = await db.query(query, [productName, description, price, stock, category, productId]);
        res.json({
            message : "수정되었습니다.",
            result : result
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

module.exports = router;