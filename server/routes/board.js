const express = require('express');
const db = require('../db');
const authMiddleware  = require('../auth');
const router = express.Router();
const multer  = require('multer')

router.get("/", async (req, res) => {
    let {} = req.query;
    try{
        let [list] = await db.query("SELECT * FROM TBL_BOARD");
        res.json({
            message : "result",
            list : list,
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.get("/:boardNo", async (req, res) => {
    let { boardNo } = req.params;
    try{
        let [list] = await db.query("SELECT * FROM TBL_BOARD WHERE BOARDNO = ?", [boardNo]);
        console.log(list);
        res.json({
            message : "result",
            info : list[0],
            boardNo : boardNo 
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.post("/", async (req, res) => {
    let { title, contents, userId } = req.body;
    console.log(title, contents, userId)
    try{
        let query = "INSERT INTO TBL_BOARD VALUES(NULL, ?, ?, ?, 0, NOW(), NOW())";
        let result = await db.query(query, [title, contents, userId]);
        console.log(result);
        res.json({
            message : "result",
            result : result[0],
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.delete("/:boardNo", async (req, res) => {
    let { boardNo } = req.params;
    try{
        let result = await db.query("DELETE FROM TBL_BOARD WHERE BOARDNO = ?", [boardNo]);
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

router.put("/:boardNo", async (req, res) => {
    let { boardNo } = req.params;
    let { title, contents } = req.body;
    try{
        let query = "UPDATE TBL_BOARD SET "
                    + "title=?, contents=? "
                    + "WHERE boardNo = ?";
        let result = await db.query(query, [title, contents, boardNo]);
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