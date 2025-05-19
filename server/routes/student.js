const express = require('express');
const db = require('../db');
const authMiddleware  = require('../auth');
const router = express.Router();
const multer  = require('multer')

router.get("/", async (req, res) => {
    let {} = req.query;
    try{
        let [list] = await db.query("SELECT * FROM STUDENT");
        res.json({
            message : "result",
            list : list,
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.get("/:stuNo", async (req, res) => {
    let { stuNo } = req.params;
    try{
        let [list] = await db.query("SELECT * FROM STUDENT WHERE STU_NO = ?", [stuNo]);
        console.log(list);
        res.json({
            message : "result",
            info : list[0],
            stuNo: stuNo 
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.post("/:stuNo", async (req, res) => {
    let { stuNo } = req.params;
    try{
        let query = "INSERT INTO STUDENT VALUES(NULL, ?, ?, ?, ?, ?, 'Y', NOW(), NOW())";
        let [result] = await conn.query(query, [productName, description, price, stock, category]);
        let stuNo = result.insertId;
        console.log(list);
        res.json({
            message : "result",
            info : list[0],
            stuNo: stuNo 
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.delete("/:stuNo", authMiddleware, async (req, res) => {
    let { stuNo } = req.params;
    try{
        let result = await db.query("DELETE FROM STUDENT WHERE STU_NO = ?", [stuNo]);
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

router.put("/:stuNo", async (req, res) => {
    let { stuNo } = req.params;
    let {productName, description, price, stock, category} = req.body;
    try{
        let query = "UPDATE STUDENT SET "
                    + "stu_no=?, stu_name=?, stu_dept=?, stu_grade=?, stu_class=? "
                    + "WHERE stu_no = ?";
        let result = await db.query(query, [productName, description, price, stock, category, stuNo]);
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