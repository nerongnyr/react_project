const express = require('express');
const db = require('../db');
const authMiddleware  = require('../auth');
const router = express.Router();
const multer  = require('multer')

router.get("/", async (req, res) => {
    let { userId } = req.query;
    try{
        let sql = "SELECT * FROM TBL_FEED";
        let imgSql = "SELECT * FROM TBL_FEED F"
                + " INNER JOIN TBL_PRODUCT_FILE I ON F.ID = I.PRODUCTID";
        if(userId) {
            sql += " WHERE USERID = '" + userId + "'";
            imgSql += " WHERE USERID = '" + userId + "'";
        }
        let [list] =  await db.query(sql);
        let [imgList] =  await db.query(imgSql);
        res.json({
            message : "result",
            list : list,
            imgList : imgList
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    let { id } = req.params;
    try{
        let result = await db.query("DELETE FROM TBL_FEED WHERE ID = ?", [id]);
        res.json({
            message : "result",
            result : result,
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  
  const upload = multer({ storage });
  
router.post("/", upload.array("images"), async (req, res) => {
    const { userId, content } = req.body;
    const files = req.files;
  
    try {
      // 1. 피드 정보 저장
      const query = "INSERT INTO TBL_FEED VALUES (NULL, ?, ?, NOW())";
      const result = await db.query(query, [userId, content]);
      const feedId = result[0].insertId; // insertId를 가져오려면 필요
  
      // 2. 파일이 있다면 처리 
      if (files && files.length > 0) {
        for (const file of files) {
          const filePath = '/uploads/' + file.filename;
          const fileName = file.originalname;
  
          const fileQuery = "INSERT INTO TBL_PRODUCT_FILE VALUES(NULL, ?, ?, ?)";
          await db.query(fileQuery, [feedId, fileName, filePath]);
        }
      }
  
      res.json({
        message: "등록 성공!",
        result: result[0]
      });
    } catch (err) {
      console.error("에러 발생!", err);
      res.status(500).send("Server Error");
    }
  });  

router.get("/:id", async (req, res) => {
    let { id } = req.params;
    try {
      let query = "SELECT * FROM TBL_FEED WHERE ID = ?";
      let [list] = await db.query(query, [id]);  
      res.json({ 
            message : "result",
            feed : list[0]
       });
    } catch (err) {
      console.error("에러:", err);
      res.status(500).send("Server Error");
    }
})

router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let { userId, content } = req.body;
    try{
        let query = "UPDATE TBL_FEED SET "
                    + "userId=?, content=? "
                    + "WHERE ID = ?";
        let result = await db.query(query, [userId, content, id]);
        res.json({
            message : "result",
            result : result[0]
        });
    }catch(err){
        console.log("에러 발생!", err);
        res.status(500).send("Server Error");
    }
})

module.exports = router;