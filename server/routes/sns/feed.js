const express = require('express');
const db = require('../../db');
const router = express.Router();
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
  
  const upload = multer({ storage });
  
router.post("/", upload.array("images"), async (req, res) => {
    const { email, title, content } = req.body;
    const files = req.files;
  
    try {
      // 1. 피드 정보 저장
      const query = "INSERT INTO TBL_FEED VALUES (NULL, ?, ?, ?, NOW())";
      const result = await db.query(query, [email, title, content]);
      const feedId = result[0].insertId; // insertId를 가져오려면 필요
  
      // 2. 파일이 있다면 처리 
      for (let i = 0; i < files.length; i++) {
        const file = files[i]; 
        const imgPath = '/uploads/' + file.filename;
        const imgName = file.originalname;
        const thumbnail = (i === 0) ? 1 : 0; 
      
        const fileQuery = "INSERT INTO TBL_FEED_IMG VALUES (NULL, ?, ?, ?, ?)";
        await db.query(fileQuery, [feedId, imgName, imgPath, thumbnail]);
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

  router.get("/", async (req, res) => {
    try{
        let sql = "SELECT * FROM TBL_FEED F "
              + "INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID "
              + "WHERE THUMBNAIL = '1'";
        let [list] =  await db.query(sql);
        res.json({
            message : "result",
            list : list,
        });
    }catch(err){
        console.log("에러 발생!");
        res.status(500).send("Server Error");
    }
})

router.get("/:id", async (req, res) => {
  let { id } = req.params
  try{
      let sql = "SELECT * FROM TBL_FEED WHERE ID = " + id
      let imgSql = "SELECT * FROM TBL_FEED_IMG WHERE FEEDID = " + id
      let [list] =  await db.query(sql);
      let [imgList] =  await db.query(imgSql);
      res.json({
          message : "result",
          feed : list[0],
          imgList : imgList
      });
  }catch(err){
      console.log("에러 발생!");
      res.status(500).send("Server Error");
  }
})

module.exports = router;